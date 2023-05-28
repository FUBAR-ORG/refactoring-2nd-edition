# Chapter 01 - 리팩터링: 첫 번째 예시

> 책의 예시들이 항상 대규모 시스템에서 발췌한 코드라고 상상하면서 따라올 필요가 있음

## 1.1 자, 시작해보자

### 조건

- 다양한 연극을 외주로 받아서 공연하는 극단.
- 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 책정함.  
  - 이 극단은 비극(tragedy)과 희극(comedy)만 공연함.
- 공연료와 별개로 포인트(volume credit)을 지급해서 다음번 의뢰 시 공연료를 할인받을 수 있음.

> 일종의 충성도 프로그램

---

## 1.2 예시 프로그램을 본 소감

- 프로그램이 잘 작동하는 상황에 그저 코드가 '지저분하다'는 이유로 불평하는 것은 프로그램의 구조를 너무 미적인 기준으로만 판단하는 건 아닐까?
  - 하지만 그 코드를 수정하려면 사람이 개입되고, 사람은 코드의 미적 상태에 민감함
- 설계가 나쁜 시스템은 원하는 동작을 수행하도록 하기 위해 수정해야 할 부분을 찾고, 기존 코드과 잘 맞물려 작동하게 할 방법을 강구갛기 어려움
  - 무엇을 수정할 지 찾기 어렵다면 실수를 저질러서 버그가 생길 가능성도 높아짐

> 프로그램이 새로운 기능을 추가하기에 편한 구조가 아니라면, 먼저 기능을 추가하기 쉬운 형태로 리팩터링하고 나서 원하는 기능을 추가한다.

- 첫 번째로, 결과물(청구 내역)을 `HTML`로 출력해주는 기능이 필요
  1. 기존에 연산하던 식 중간에 조건문으로 `HTML` 태그를 추가하는 방법: 복잡도가 크게 증가
  2. 청구 내역 연산 함수의 복사본을 만들어 `HTML` 태그를 추가하는 방법: 중복 코드 발생
    - 오래 사용할 프로그램이라면 중복 코드는 골칫거리가 됨
      - 배우들이 희극과 비극 뿐만 아니라, 더 많은 장르를 연기하고 싶을 수 있음
      - 이 변경은 공연료와 적립 포인트 계산법에 영향을 줄 거임
    - 연극 장르와 공연료 정책이 달라질 때마다 함수를 수정해야 하는데, 함수를 복사해서 둔다면 계산법이 변경될 때마다 함수를 둘다 바꾸어 주어야 함

---

## 1.3 리팩터링의 첫 단계

- 리팩터링의 첫 단계: 리팩터링할 코드 영역을 꼼꼼하게 검사해줄 테스트 코드 마련

> 리팩터링하기 전에 제대로 된 테스트부터 마련한다. 테스트는 반드시 자가진단하도록 만든다.

- 테스트는 내가 저지른 실수로부터 보호해주는 버그 검출기 역할을 해줌
  - 실수 가능성을 크게 줄일 수 있음

---

## 1.4 `statement()` 함수 쪼개기

- 긴 함수를 리팩터링할 때는 먼저 전체 동작을 각각의 부분으로 나눌 수 있는 지점을 찾음
- 코드를 분석해서 정보를 얻어야 하는 경우, 잊지 않으려면 재빨리 코드에 반영해야 함
- `statement()` 함수는 한 번의 공연에 대한 요금을 계산하는 코드이므로, 이 코드 조각을 별도의 함수 `amountFor(aPerformance)`로 추출하여 이름을 붙임 

#### 함수 추출하기

- 별도의 함수로 빼냈을 때 유효 범위를 벗어나는 변수. 즉, 새 함수가 곧바로 사용할 수 없는 변수가 있는지 확인
- 새 함수 안에서 값이 바뀌지 않는 경우, 매개변수로 전달하면 됨
- 함수 안에서 값이 변경되는 변수를 사용한다면, 조심해서 다뤄야 함
  - 이번 예에서는 이런 변수가 하나 뿐이므로 값을 반환하도록 작성
- 수정을 햇다면 곧바로 컴파일 - 테스트해서 실수한 게 없는지 확인해야 함
  - 아무리 간단한 수정이라도 리팩터링 후에는 항상 테스트하는 습관을 들이는 것이 바람직함
  - 한 번에 너무 많이 수정하려다 실수를 저지르면 디버깅하기 어려워서 결과적으로 작업 시간이 늘어남

> 리팩터링은 프로그램 수정을 작은 단계로 나눠 진행한다. 그래서 중간에 실수하더라도 버그를 쉽게 찾을 수 있다.

- 수정한 사항을 테스트했을 때 문제가 없으면 버전 관리 시스템에 커밋함
  - 이렇게 자잘한 변경들이 어느 정도 의미 있는 단위로 뭉쳐지면 공유 저장소로 푸시함
- 함수 추출하기는 흔히 IDE에서 자동으로 수행해줌
- 함수를 추출하고 나면 추출된 함수 코드를 자세히 들여다보면서 지금보다 더 명확하게 표현할 수 있는 간단한 방법은 없는지 검토함
  - 변수 이름을 명확하게 변경하기
    - 동적 타이핑 언어를 사용할 때는 타입이 드러나게 작성하면 도움이 됨

> 컴퓨터가 이해하는 코드는 바보도 작성할 수 있다. 사람이 이해하도록 작성하는 프로그래머가 진정한 실력자다.

### `play` 변수 제거하기(임시 변수를 질의 함수로 바꾸기)

- 긴 함수를 쪼갤 때 로컬 범위에 존재하는 이름이 늘어나게 만드는 임시 변수는 제거함
- 참조와 관련된 성능 관계는 큰 영향을 주지 않을 경우가 많고, 심각하게 느려지더라도 제대로 리팩터링 된 코드베이스는 그렇지 않은 코드보다 성능을 개선하기가 훨씬 수월함

### 적립 포인트 계산 코드 추출하기

- 변수를 제거한 결과, 로컬 유효 범위의 변수가 하나 줄어서 적립 포인트 계산 부분을 추출하기가 훨 씬 쉬워짐

### `format` 변수 제거하기(함수 선언 바꾸기)

- 임시 변수는 나중에 문제를 일으킬 수 있음
  - 임시 변수는 자신이 속한 루틴에서만 의미가 있어서 루틴이 길고 복잡해지기 쉬움
- 이름짓기는 중요하면서도 쉽지 않은 작업
- 긴 함수를 작게 쪼개는 리팩터링은 이름을 잘 지어야만 효과가 있음
- 변수 이름을 잘 지으면 코드의 의도를 명확하게 표현할 수 있음
  - 처음엔 당장 떠오르는 최선의 이름을 사용하다가, 나중에 더 좋은 이름이 떠오를 때 바꾸는 것이 좋음
  - 코드를 두 번 이상 읽고 나서야 가장 적합한 이름이 떠오르곤 함

### `volumeCredits` 변수 제거하기(반복문 쪼개기)

- 반복문을 한 바퀴 돌 때마다 값을 누적하기 때문에 리팩터링하기 더 까다로움
- `volumeCredits` 값 갱신과 관련한 문장들을 한 데 모아두면 **임시 변수를 질의 함수로 바꾸기**가 수월해짐
- 반복문을 쪼개서 성능이 느려지지 않을까 걱정할 수 있음
  - 이정도 반복문의 중복은 성능에 미치는 영향이 미미할 때가 많음
  - 똑똑한 컴파일러들은 최신 캐싱 기법으로 무장하고 있어서 우리의 직관을 초월하는 결과를 내주기도 함
- 만약 성능에 영향을 주더라도 리팩터링했을 때의 이점은 있음
  - 잘 다듬어진 코드이어야 성능 개선 작업도 훨씬 수월하기 때문
  - 리팩터링 과정에서 성능이 크게 떨어졌다면 리팩터링 후 시간을 내어 성능을 개선함
    - 이 과정에서 리팩터링된 코드를 예전으로 되돌리는 경우도 있지만, 대체로 리팩터링 덕분에 성능 개선을 효과적으로 수행 가능

> 성능 문제는 특별한 경우가 아니면 일단 무시하라.

- `volumeCredits` 변수를 제거하는 작업의 단계를 아주 잘게 나눔
  1. **반복문 쪼개기** 로변수 값을 누적시키는 부분을 분리한다.
  2. **문장 슬라이드하기** 로 변수 초기화 문장을 변수 값 누적 코드 바로 앞으로 옮긴다.
  3. **함수 추출하기** 로 적립 포인트 계산 부분을 별도 함수로 추출한다.
  4. **변수 인라인하기** 로 `volumeCredits` 변수를 제거한다.
- 항상 단계를 잘게 나눌 수는 없지만, 상황이 복잡해지면 단계를 더 작게 나누는 일을 가장 먼저 할 필요가 있음
  - 특히 리팩터링 중간에 테스트가 실패하고 원인을 바로 찾지 못하면 가장 최근 커밋으로 돌아가서 테스트에 실패한 리팩터링 단계를 더 작게 나눠 다시 시도함
- `totalAmount`도 앞에서와 똑같은 절차로 제거할 수 있음
  - 다만, 추출할 함수의 이름이 이미 같은 이름의 변수가 있기 때문에 아무거나 생각나는 단어로 지음(임시)

> 각각의 절차에 반드시 컴파일-테스트-커밋이 수행되어야 한다.

---

##  1.5 중간 점검: 난무하는 중첩 함수

### 공통 데이터

```json
{
  "plays": {
    "hamlet": { "name": "Hamlet", "type": "tragedy" },
    "as-like": { "name": "As You Like It", "type": "comedy" },
    "othello": { "name": "Othello", "type": "tragedy" }
  },
  "invoices": [
    {
      "customer": "BigCo",
      "performances": [
        {
          "playID": "hamlet",
          "audience": 55
        },
        {
          "playID": "as-like",
          "audience": 35
        },
        {
          "playID": "othello",
          "audience": 40
        }
      ]
    }
  ]
}
```

### 리팩터링 전 코드

```js
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US",
                        { style: "currency", currency: "USD",
                          minimumFractionDigits: 2 }).format;
  
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy": // 비극
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy": // 희극
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
    
    // 청구 내역을 출력한다.
    result += ` ${play.name}: ${format(thisAmount/100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}
```

### 리팩터링 후 코드

```js
function statment(invoice, plays) {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  }
  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;
  
  function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }
  // 여기서부터 중첩함수 시작
  function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
                        { style: "currency", currency: "USD",
                          minimumFractionDigits: 2 }).format(aNumber/100);
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case "tragedy": // 비극
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy": // 희극
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result;
  } // amountFor() 끝
} // statment() 끝

```

- 최상위 `statement()` 함수는 단 일곱 줄 뿐이며, 출력할 문장을 생성하는 일만 함
- 계산 로직은 모두 여러 개의 보조 함수로 빼냄

> 결과적으로 각 계산 과정은 물론 전체 흐름을 이해하기가 훨씬 쉬워졌다.