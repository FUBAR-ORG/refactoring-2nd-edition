# Chapter 01 - 리팩터링: 첫 번째 예시

> 책의 예시들이 항상 대규모 시스템에서 발췌한 코드라고 상상하면서 따라올 필요가 있음

## 1.1 자, 시작해보자

### 조건

- 다양한 연극을 외주로 받아서 공연하는 극단
- 공연 요청이 들어오면 연극의 장르(`type`)와 관객 규모(`audience`)를 기초로 비용을 책정함
  - 이 극단은 비극(`tragedy`)과 희극(`comedy`)만 공연함
- 공연료와 별개로 포인트(volume credit)을 지급해서 다음번 의뢰 시 공연료를 할인받을 수 있음

> 일종의 충성도 프로그램

---

## 1.2 예시 프로그램을 본 소감

- 프로그램이 잘 작동하는 상황에 그저 코드가 '지저분하다'는 이유로 불평하는 것은 프로그램의 구조를 너무 미적인 기준으로만 판단하는 건 아닐까?
  - 하지만 그 코드를 수정하려면 사람이 개입되고, 사람은 코드의 미적 상태에 민감함
- 설계가 나쁜 시스템은 원하는 동작을 수행하도록 하기 위해 수정해야 할 부분을 찾고, 기존 코드과 잘 맞물려 작동하게 할 방법을 강구하기 어려움
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

## 1.5 중간 점검: 난무하는 중첩 함수

### 공통 데이터

```json
{
  "plays": {
    "hamlet": {
      "name": "Hamlet",
      "type": "tragedy"
    },
    "as-like": {
      "name": "As You Like It",
      "type": "comedy"
    },
    "othello": {
      "name": "Othello",
      "type": "tragedy"
    }
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
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format;

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
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
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
      {
        style: "currency", currency: "USD",
        minimumFractionDigits: 2
      }).format(aNumber / 100);
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

---

## 1.6 계산 단계와 포맷팅 단계 분리하기

- `statement` 실행 부분을 그대로 복사하여 `HTML`을 생성하는 구문을 만드려고 하니, `statement` 함수 내부에 값을 계산하는 함수가 포함되어 있어 모두 복사해야 하는 현상이 발생
- 여기서, **단계 쪼개기** 방법을 이용해볼 수 있음
- 단계를 쪼개려면 두 번째 단계가 될 코드들을 **함수 추출하기**로 뽑아내야 함
- 다음으로 두 단계 사이의 중간 데이터 구조 역할을 할 객체를 만들어서 뽑아낸 함수에 인수로 전달함
  - 이렇게 하면 계산 관련 코드는 전부 `statement()` 함수로 모으고 뽑아낸 `renderPlainText()` 함수는 `data` 매개변수로 전달된 데이터만 처리할 수 있음

> 함수로 건낸 데이터를 수정하는 것은 예상치 못한 동작을 유발시킬 가능성이 높음  
> 가변(`mutable`) 데이터는 금방 상하기 때문에 최대한 불변(`immutable`)처럼 취급

- 그렇게 다음과 같이 계산이 완료된 결과를 객체에 삽입

```js
const result = Object.assign({}, aPerformance);
result.play = playFor(result);
result.amount = amountFor(result);
result.volumeCredits = volumeCreditsFor(result);
```

- `playFor(perf)` -> `perf.play`
- `amountFor(perf)` -> `perf.amount`
- `volumeCreditsFor(perf)` -> `perf.volumeCredits`
- 이처럼 미리 계산이 필요한 부분을 모두 계산한 상태로 렌더링만 하도록 함수를 변경

> 추가로, `for` 반복문을 **반복문을 파이프라인으로 바꾸기**를 적용해보자.

- 그 후, 계산하는 부분을 새로운 파일로 추출

---

## 1.7 중간 점검: 두 파일(과 두 단계)로 분리됨

- 코드량이 부쩍 늘어났지만, 전체 로직을 구성하는 요소 각각이 더 뚜렷이 부각되고, 계산하는 부분과 출력 형식을 다루는 부분이 분리
- 모듈화를 통해 각 부분이 하는 일과 그 부분들이 맞물려 돌아가는 과정을 파악하기 쉬워짐

> 간결함이 지혜의 정수일지 몰라도, 프로그래밍에서만큼은 명료함이 진화할 수 있는 소프트웨어의 정수

> 프로그래밍도 캠핑자들처럼 "도착했을 때보다 깔끔하게 정돈하고 떠난다."라는 규칙을 중시하여, "코드베이스를 작업 시작 전보다 건강하게(healthy) 만들어놓고 떠나야 한다."

- 리팩터링과 기능 추가 사이에서 균형을 맞추려고 노력해야 함

### `statement.js`

```js
import createStatementData from "./createStatementData.js";

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) {
  let result = `청구 내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }
  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
  return result;
}

function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`;
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}
```

### `createStatementData.js`

```js
export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;
}

function enrichPerformance(aPerformance) {
  const result = Object.assign({}, aPerformance);
  result.play = playFor(result);
  result.amount = amountFor(result);
  result.volumeCredits = volumeCreditsFor(result);
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
  let result = 0;
  switch (aPerformance.play.type) {
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
      throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
  }
  return result;
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
  if ("comedy" === aPerformance.play.type)
    result += Math.floor(aPerformance.audience / 5);
  return result;
}

function totalAmount(data) {
  return data.performances.reduce((total, p) => total + p.amount, 0);
}

function totalVolumeCredits(data) {
  return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}
```

---

## 1.8 다형성을 활용해 계산 코드 재구성하기

> 연극 장르를 추가하고 장르마다 공연료와 적립 포인트 계산법을 다르게 지정하도록 기능을 수정

- `amountFor` 함수와 같은 조건부 로직은 코드 수정 횟수가 늘어날수록 골칫거리로 전락하기 쉬움
  - 이를 방지하기 위해 프로그래밍 언어가 제공하는 구조적인 요소로 보완해야 함
- 이를 위해 객체 지향의 핵심 특성인 **다형성**을 활용해볼 수 있음
- 상속 계층을 구성해서 희극 서브 클래스와 비극 서브 클래스가 각자의 구체적인 계산 로직을 정의할 수 있음
  - **조건부 로직을 다형성으로 바꾸기**를 사용해볼 수 있음
  - 이 리팩터링을 적용하려면 상속 계층부터 정의해야 함
    - 즉, 공연료와 적립 포인트 계산 함수를 담을 클래스가 필요

> 앞서 수행한 리팩터링 덕분에 출력 포맷 관련 코드에서는 신경 쓸 일이 없음  
> 더 확실하게 하려면 중간 데이터 구조를 검사하는 테스트를 추가

### 공연료 계산기 만들기

- 핵심은 중간 데이터 구조에 채워주는 `enrichPerformance()` 함수
  - 이 함수는 조건부 로직을 포함한 함수 `amountFor()`와 `volumeCreditsFor()`를 호출하여 공연료와 적립 포인트를 계산
  - 이 두 함수를 전용 클래스로 옮김
- 공연 관련 데이터를 계산하는 함수들로 구성되므로 공연료 계산기(`PerformanceCalculator`)로 설정
- 이 작업을 통해 큰 변화가 없더라도, 모든 데이터 변환을 한 곳에서 수행할 수 있어서 코드가 명확해질 수 있음

### 함수들을 계산기로 옮기기

- 지금까지는 중첩 함수를 재배치하는 것이어서 큰 부담이 없었으나, 함수를 다른 컨텍스트로 옮기는 큰 작업이므로 부담이 생김
  - **함수 옮기기** 리팩터링으로 작업을 단계별로 차근차근 진행
  - 진행하면서 이동한(이사간) 코드가 제대로 동작하는지 확인하고, 문제가 없다면 원래 **함수를 인라인**하여 새 함수를 호출하도록 수정

### 공연료 계산기를 다형성 버전으로 만들기

- 가장 먼저 할 일은 타입 코드(`type-code`) 대신 서브 클래스를 사용하도록 변경하는 것
  - **타입 코드를 서브 클래스로 바꾸기**
  - `PerformanceCalculator`의 서브 클래스들을 준비하고, `createStatementData()`에서 그중 적합한 서브 클래스를 사용하게 만들어야 함
  - **생성자를 팩터리 함수로 바꾸기**
- 여기까지 완료됐다면 **조건부 로직을 다형성으로 바꾸기**를 적용할 차례

```js
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    // 미래에 나에게 한 마디 남겨놓는 것이 좋음
    // 에러를 발생할 때는 명시적으로 에러를 발생시키는 것이 좋음
    // `switch` 문에서 `default`에서 에러를 발생시키기 보다는 명시적으로 에러를 발생시키는 것이 좋은 것과 같음
    throw new Error('서브 클래스에서 처리하도록 설계되었습니다.');
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (aPerformance.audience > 30) {
      result += 1000 * (aPerformance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (aPerformance.audience > 20) {
      result += 10000 + 500 * (aPerformance.audience - 20);
    }
    result += 300 * aPerformance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(aPerformance.audience / 5);
  }
}
```

- 일반적인 경우를 기본으로 삼아 슈퍼 클래스에 남겨두고, 장르마다 달라지는 부분은 필요할 때 오버라이드하게 만드는 것이 좋음

---

## 1.9 상태 점검: 다형성을 활용하여 데이터 생성하기

- 이번 수정으로 연극 장르별 계산 코드들을 함께 묶어둘 수 있었음
- 이제 새로운 장르를 추가하려면 해당 장르의 서브 클래스를 작성하고 생성 함수인 `createPerformanceCalculator()`에 추가하기만 하면 됨
  - 두 개의 함수 `amountFor()`와 `volumeCreditsFor()`의 조건부 로직을 생성 함수 하나로 옮김
    - 같은 타입의 다형성을 기반으로 실행되는 함수가 많을 수록 이렇게 구성하는 쪽이 유리함
- `createStatementData()` 함수가 계산기 자체를 반환하게 구현해도 됨

> 계산기 인스턴스를 반환하는 방식과 각각의 출력 값으로 직접 계산하는 방식 중 하나를 선택할 때, 결과로 나온 데이터 구조를 누가 사용하는가를 기준으로 결정

---

## 1.10 마치며

- 첫 리팩터링을 통해 **함수 추출하기**, **변수 인라인하기**, **함수 옮기기**, **조건부 로직을 다형성으로 바꾸기**를 비롯한 다양한 리팩터링 기법을 선보임
- 이번 장에서는 리팩터링을 크게 세 단계로 진행
  1. 원본 함수를 중첩 함수 여러 개로 나눔
  2. **단계 쪼개기**를 적용해서 계산 코드와 출력 코드 분리
  3. 계산 로직을 다형성으로 표현
- 리팩터링은 대부분 코드가 하는 일을 파악하는 데서 시작
  - 코드를 읽고, 개선점을 찾고, 리팩터링 작업을 통해 개선점을 코드에 반영하는 식으로 진행
- 그 결과 코드가 명확해지고 이해하기 쉬워지고, 또 다른 개선점이 떠오르며 선순환이 형성

> "좋은 코드를 가늠하는 확실한 방법은 '얼마나 수정하기 쉬운가'이다"

- 미적인 관점으로 코드의 취향을 나타내는 것 이상의 관점을 가진 코드는 존재하며, 코드는 명확해야 함
- 코드를 수정해야 할 상황이 되면 고쳐야 할 곳을 쉽게 찾을 수 있고 오류 없이 빠르게 수정할 수 있어야 함
- 건강한 코드베이스는 생산성을 극대화하고, 고객에게 필요한 기능을 더 빠르고 저렴한 비용으로 제공하도록 해줌
- 프로그래밍 팀의 현재와 이상의 차이에 항상 신경쓰면서, 이상에 가까워지도록 리팩터링해야 함

---

> 가장 중요한 것은 리팩터링 하는 리듬

### 리팩터링을 효과적으로 하는 핵심

- 단계를 잘게 나눠야 더 빠르게 처리할 수 있고, 코드는 절대 깨지지 않으며, 이러한 작은 단계들이 모여서 상당히 큰 변화를 이룰 수 있다는 사실을 깨닫는 것