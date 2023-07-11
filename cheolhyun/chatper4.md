# Chapter 04 - 테스트 구축하기

## 4.1 자가 테스트 코드의 가치

- 프로그래머는 실제 코드 작성 시간보다 설계, 디버깅에 많은 시간을 할애한다
- 버그 수정 자체는 금방 끝나지만, 이 과정에서 새로운 버그를 심을 수 있다
- 테스트가 컴파일만큼 쉬워지면서, 디버깅 시간이 줄어들었고 생산성이 급증했다
- 버그 발생 시점은 곧 테스트가 깨진 순간이며, 테스트를 자주 수행할수록 버그가 발생한 지점을 쉽게 찾을 수 있다

> 자가 테스트 코드 자체 뿐만 아니라, 테스트를 자주 수행하는 습관도 버그를 찾는 강력한 도구가 된다.

> 회귀 버그(regression bug): 잘 작동하던 기능에서 문제가 생기는 현상.  
> 일반적으로 프로그램을 변경하던 중 뜻하지 않게 발생한다.  
> 같은 맥락에서, 잘 작동하던 기능이 여전히 잘 작동하는지 확인하는 테스트를 회귀 테스트(regression test)라 한다.

> 테스트 스위트는 강력한 버그 검출 도구로, 버그를 찾는 데 걸리는 시간을 대폭 줄여준다.

- 테스트를 작성하기 가장 좋은 시점은 프로그래밍을 시작하기 전이다
  - 기능을 추가해야 할 때
- 테스트를 작성하다 보면 원하는 기능을 추가하기 위해 무엇이 필요한지 고민하게 된다
  - 구현보다 인터페이스에 집중하게 될 수 있다(무조건 좋은 일)
- 코딩이 완료되는 시점은 곧 테스트를 모두 통과한 시점으로, 정확하게 판단할 수 있다

### 테스트 주도 개발(TDD, Test-Driven Development)

- 테스트를 작성하고, 이 테스트를 통과하게끔 코드를 작성하고, 결과 코드를 최대한 깔끔하게 리팩터링하는 과정을 짧은 주기로 반복하는 것
  - 테스트 - 코딩 - 리팩터링 과정
- 코드를 대단히 생산적이면서 차분하게 작성할 수 있다

> 리팩터링에는 테스트가 필요하다. 그러니 리팩터링을하고 싶다면 테스트를 반드시 작성해야 한다.

---

## 4.2 테스트할 샘플 코드

- 테스트 대상이 될 코드: 사용자가 생산 계획을 검토하고 수정하도록 해주는 간단한 애플리케이션의 일부
- 생산 계획은 각 지역(province)의 수요(demand)와 가격(price)으로 구성
- 지역에 위치한 생산자(producer)들은 각기 제품을 특정 가격으로 특정 수량만큼 생산 가능
- `UI`는 생산자별로 제품을 모두 판매했을 때 얻을 수 있는 수익(full revenue)도 보여줌
  - 추가로 생산 부족분(shortfall, 수요 - 총생산량), 현재 계획에서 거둘 수 있는 총 수익(profit)도 보여줌

> 비즈니스 로직만 생각한다.

- 비즈니스 로직 코드는 클래스 두 개로 구성된다
  1. 생산자(`Producer`)
  2. 지역 전체(`Province`)
- 지역 정보를 읽어오는 코드
  ```javascript
  class Province {
    constructor(doc) {
      this._name = doc.name;
      this._producers = [];
      this._totalProduction = 0;
      this._demand = doc.demand;
      this._price = doc.price;
      doc.producers.forEach(d => this.addProducer(new Producer(this, d)));
    }
    
    addProducer(arg) {
      this._producers.push(arg);
      this._totalProduction += arg.production;
    }
  }
  ```
- 생성자의 인수로 쓸 `JSON` 데이터를 생성하는 함수
  ```javascript
  function sampleProvinceData() {
    return {
      name: "Asia",
      producers: [
        { name: "Byzantium", cost: 10, production: 9 },
        { name: "Attalia", cost: 12, production: 10 },
        { name: "Sinope", cost: 10, production: 6 },
      ],
      demand: 30,
      price: 20,
    };
  }
  ```
- `Province` 클래스에 담겨 있는 데이터 접근자
  ```javascript
  class Province {
    get name() { return this._name; }
    get producers() { return this._producers.slice(); }
    get totalProduction() { return this._totalProduction; }
    set totalProduction(arg) { this._totalProduction = arg; }
    get demand() { return this._demand; }
    set demand(arg) { this._demand = parseInt(arg); }
    get price() { return this._price; }
    set price(arg) { this._price = parseInt(arg); }
  }
  ```
- `Producer` 클래스
  ```javascript
  class Producer {
    constructor(aProvionce, data) {
      this._province = aProvionce;
      this._cost = data.cost;
      this._name = data.name;
      this._production = data.production || 0;
    }
    
    get name() { return this._name; }
    get cost() { return this._cost; }
    set cost(arg) { this._cost = parseInt(arg); }
  
    get production() { return this._production; }
    set production(amountStr) {
      // 이 코드가 지저분하다
      const amount = parseInt(amountStr);
      const newProduction = Number.isNaN(amount) ? 0 : amount;
      this._province.totalProduction += newProduction - this._production;
      this._production = newProduction;
    }
  }
  ```
- 생산 부족분을 계산하는 코드
  ```javascript
  class Province {
    get shortfall() {
      return this._demand - this.totalProduction;
    }
  }
  ```
- 수익을 계산하는 코드
  ```javascript
  class Province {
    get profit() {
      return this.demandValue - this.demandCost;
    }
    get demandValue() {
      return this.satisfiedDemand * this.price;
    }
    get satisfiedDemand() {
      return Math.min(this._demand, this.totalProduction);
    }
    get demandCost() {
      let remainingDemand = this.demand;
      let result = 0;
      this.producers
        .sort((a, b) => a.cost - b.cost)
        .forEach(p => {
          const contribution = Math.min(remainingDemand, p.production);
          remainingDemand -= contribution;
          result += contribution * p.cost;
        });
      return result;
    }
  }
  ```

---

## 4.3 첫 번째 테스트

- 생산 부족분 테스트
  ```javascript
  describe('province', () => {
    it('shortfall', () => {
      const asia = new Province(sampleProvinceData());
      expect(asia.shortfall).equal(5);
    });
  });
  ```
- 위 예제에서는 테스트를 두 단계로 진행한다
  1. 테스[](https://www.coupang.com/vp/products/7387352959?itemId=19092764878&vendorItemId=86213656329&q=%EB%8F%85%EC%84%9C%EB%8C%80&itemsCount=36&searchId=76c60b24eade41c8923d918507643966&rank=29&isAddedCart=)트에 필요한 데이터와 객체를 뜻하는 픽스쳐(fixture, 고정장치)를 설정한다

  - `Province` 객체를 픽스처로 설정

  2. 이 픽스쳐들의 속성을 검증하는데, 주어진 초깃값에 기초하여 생산 부족분을 정확히 계산했는지 확인

> `describe` 블록과 `it` 블록에 부연 설명용 문자열을 써넣는 방식은 개발자마다 다르다.

> 실패해야 할 상황에서는 반드시 실패하게 만들자.

- 기존 코드를 검증하는 테스트를 통과했다는 건 좋은 일이지만, 실패하는 모습을 직접 확인하는 것도 중요하다
  - 이를 위해 일시적으로 코드에 오류를 주입할 수 있다

> 자주 테스트하라. 작성 중인 코드는 최소한 몇 분 간격으로 테스트하고, 적엉도 하루에 한 번은 전체 테스트를 돌려보자.

- 간결한 피드백은 자가 테스트에서 매우 중요하다
- 실패한 테스트가 하나라도 있으면 리팩터링하면 안 된다
- `GUI`를 사용하든 사용하지 않든 모든 테스트가 통과했다는 사실을 빨리 알 수 있어야 한다는 것이 핵심이다

---

## 4.4 테스트 추가하기

- 클래스가 하는 일을 모두 살펴보고 각각의 기능에서 오류가 생길 수 있는 조건을 하나씩 테스트하는 식으로 진행한다
- 일부 프로그래머들이 선호하는 `public` 메서드를 빠짐없이 테스트하는 방식과는 다르다
  - 테스트는 위험 요인을 중심으로 작성해야 한다
  - 테스트의 목적은 어디까지나 현재 혹은 향후에 발생하는 버그를 찾는 데 있다
    - 따라서 너무 단순한 로직을 테스트할 필요는 없다
- 테스트를 너무 많이 만들다 보면 오히려 필요한 테스트를 놓치기 쉽기 때문에 아주 중요한 포인트이다

> 완벽하게 만드느라 테스트를 수행하지 못하느니, 불완전한 테스트라도 작성해 실행하는 게 낫다.

- 총 수익 테스트
  ```javascript
  describe('province', () => {
    it('profit', () => {
      const asia = new Province(sampleProvinceData());
      expect(asia.profit).equal(230);
    });
  });
  ```
- 여기에 작성된 `230`이라는 결과 값을 도출하기 위해 다음과 같은 과정을 지나칠 수 있다
  1. 임의의 값을 넣고 테스트 수행
  2. 프로그램이 내놓는 실제 값으로 대체
  3. 기존 로직을 잘못된 값을 내놓도록 수정
  4. 테스트가 실패하는지 확인
- 기존 코드를 검사하는 테스트를 추가할 때 흔히 쓰일 수 있는 방식
- 지금까지 작성한 두 테스트에는 첫 줄에서 똑같은 픽스처를 설정하는 부분이 있다
  - 테스트 코드에서도 중복은 의심해봐야 한다
- 바깥 범위로 끌어내는 방법
  ```javascript
  describe('province', () => {
    const asia = new Province(sampleProvinceData());
    it('shortfall', () => {
      expect(asia.shortfall).equal(5);
    });
    it('profit', () => {
      expect(asia.profit).equal(230);
    });
  })
  ```
  - 이 방법은 테스트 관련 버그 중 가장 지저분한 유형인 '테스트끼리 상호작용하게 하는 공유 픽스처'를 생성하는 원인이 된다
  - `JavaScript`에서 `const` 키워드는 `asia` 객체의 '내용'이 아니라 `asia`를 가리키는 참조가 상수임을 뜻한다
    - 따라서 나중에 다른 테스트에서 이 공유 객체의 값을 수정하면 이 픽스처를 사용하는 또 다른 테스트가 실패할 수 있다
  - 즉, 테스트를 실행하는 순서에 따라 결과가 달라질 수 있다
- `beforeEach` 구문
  ```javascript
  describe('province', () => {
    let asia;
    beforeEach(() => {
      asia = new Province(sampleProvinceData());
    });
    it('shortfall', () => {
      expect(asia.shortfall).equal(5);
    });
    it('profit', () => {
      expect(asia.profit).equal(230);
    });
  })
  ```
  - `be`