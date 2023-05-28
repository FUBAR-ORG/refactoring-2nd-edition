# 리팩터링: 첫 번째 예시

## 예시 프로그램 소개
다양한 연극을 외주로 받아서 공연하는 극단의 청구 프로그램을 예시로 사용합니다.   
이를 HTML 페이지로 출력할 수 있도록 코드를 리팩터링 하는 과정을 보여줍니다.

`plays.json`
```json
{
  "hamlet": { "name": "Hamlet", "type": "tragedy" },
  "as-like": { "name": "As You Like It", "type": "comedy" },
  "othello": { "name": "Othello", "type": "tragedy" }
}
```

`invoice.json`
```json
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
```

`statement.js`
```js
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const { format } = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

  for (const perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case 'comedy':
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    volumeCredits += Math.max(perf.audience - 30, 0);

    if (play.type === 'comedy') {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    result += `${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n;`;
  return result;
}
```

## 1.2 예시 프로그램을 본 소감

예시 프로그램을 보면 그럭저럭 쓸만하다는 생각이 듭니다. 하지만 이런 코드가 수백 줄짜리 프로그램의 일부라면 간단한 인라인 함수 하나라도 이해하기가 쉽지 않습니다.   
그저 코드가 '지저분하다'는 이유로 불평하는 건 코드를 **너무 미적인 기준으로만 판단하는 건 아닐까?** 라는 의문을 제기하는데요.   
**코드를 수정하려면 사람이 개입되고, 사람은 코드의 미적 상태에 민감**하다는 이유로 이를 반박하고 있습니다.   
무엇을 수정할지 찾기 어렵다면 실수로 인해 버그가 생길 가능성도 높아집니다. 따라서 코드를 수정하거나 새로운 기능을 추가할 때 리팩터링 후 원하는 기능을 추가해야 합니다.   
변경할 일이 절대 없다면 코드를 현재 상태로 나둬도 문제가 없습니다. 하지만 다른 사람이 읽고 이해해야 할 일이 생겼는데 로직을 파악하기 어렵다면 뭔가 대책을 마련해야 합니다.

## 1.3 리팩터링의 첫 단계
첫 단계는 리팩터링할 코드를 꼼꼼하게 검사해줄 테스트 코드를 작성하는 것입니다.   
테스트는 개발자가 일일이 눈으로 비교할 필요 없게 자가진단 할 수 있어야 합니다.

## 1.4 statement() 함수 쪼개기
중간 즈음의 switch 문을 함수로 추출해보겠습니다.    

`함수 추출하기`
```js
function amountFor(aPerformance, play) {
  let thisAmount = 0;

  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (aPerformance.audience > 30) {
        thisAmount += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (aPerformance.audience > 20) {
        thisAmount += 10000 + 500 * (aPerformance.audience - 20);
      }
      thisAmount += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }

  return thisAmount;
}
```

```js
    // ...
    const thisAmount = amountFor(perf, play);
    // ...
}
```

### play 변수 제거하기

긴 함수를 잘게 쪼갤 때마다 play 같은 변수를 최대한 제거해 추출 작업을 수월하게 만들어야 합니다.

`임시 변수를 질의 함수로 바꾸기`
```js
function playFor(aPerformance) {
    return plays[aPerformance.playID];
}
```

`임시 변수 질의 함수로 바꾸기` → `변수 인라인하기` → `함수 선언 바꾸기` 과정을 거친 최종 코드
```js
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
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
  }

  for (const perf of invoice.performances) {
    volumeCredits += Math.max(perf.audience - 30, 0);

    if (playFor(perf).type === 'comedy') {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    result += `${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n;`;
  return result;
}
```

play 변수 제거로 인해 성능에 미치는 영향은 걱정하지 않아도 됩니다. 설사 느려지더라도 먼저 리팩터링된 코드베이스는 성능을 개선하기가 훨씬 수월하기 때문입니다.   
지역 변수를 제거했을 때 얻는 가장 큰 장점은 추출 작업이 쉬워져 신경 써야할 유효범위가 줄어드는 것입니다.

### 적립 포인트 계산 코드 추출하기

```js
  function volumeCreditsFor(aPerformance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);

    if (playFor(aPerformance).type === 'comedy') {
      volumeCredits += Math.floor(aPerformance.audience / 5);
    }

    return volumeCredits;
  }
```

### format 변수 제거하기
```js
function usd(aNumber) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(
    aNumber
  );
}
```

### volumeCredits 변수 제거하기
`반복문 쪼개기` 로 volumeCredits 값이 누적되는 부분을 따로 빼냅니다.   
이처럼 반복문을 쪼개서 성능이 느려지는 것을 걱정하는 경우도 많은데, 이 정도 중복은 성능에 미치는 영향이 미미한 경우가 많습니다.
```js
function totalVolumeCredits() {
  let result = 0;
  for (const perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }
  return result ;
}
```


### totalAmount 변수 제거하기
```js
function totalAmount() {
    let result = 0;
    for (const perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
}
```

## 1.5 중간 점검: 난무하는 중첩 함수
중첩 함수가 많이 존재하지만, statement 함수의 코드가 줄어들었으며,
계산 로직을 여러 개의 보조함수로 빼내어 결과적으로 각 계산 과정은 물론 전체 흐름을 이해하기가 훨씬 쉬워졌습니다.

```js
function statement(invoice, plays) {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
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
  }

  function volumeCreditsFor(aPerformance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);

    if (playFor(aPerformance).type === 'comedy') volumeCredits += Math.floor(aPerformance.audience / 5);

    return volumeCredits;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(
      aNumber / 100
    );
  }

  function totalVolumeCredits() {
    let result = 0;
    for (const perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function totalAmount() {
    let result = 0;
    for (const perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  for (const perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n;`;
  return result;
}
```

## 1.6 계산 단계와 포매팅 단계 분리하기
지금까지는 논리적인 요소를 파악하기 쉽도록 코드의 구조를 보강하는 데 주안점을 두고 리팩터링했습니다.   
이후 statment 함수의 HTML 버전을 만드는 작업을 하는데 가장 큰 문제점은 중첩 함수로 들어가있는 함수들입니다.   
이 상황에서 저자는 `단계 쪼개기`를 제안합니다.
```js
function renderPlainText(data) {
  function usd(aNumber) {...}

  let result = `청구 내역 (고객명: ${data.customer})\n`;

  for (const perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n;`;
  return result;
}

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));

  function createStatementData(invoice, plays) {
    return {
      customer: invoice.customer,
      performances: invoice.performances.map(enrichPerformance),
      totalAmount: totalAmount(),
      totalVolumeCredits: totalVolumeCredits(),
    };
  }

  // 불변객체를 위한 함수
  function enrichPerformance(aPerformance) {
    const result = { ...aPerformance };
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function playFor(aPerformance) {...}
  function amountFor(aPerformance) {...}
  function volumeCreditsFor(aPerformance) {...}
  function totalVolumeCredits() {...}
  function totalAmount() {...}
}
```

두 단계가 명확히 분리되어 각 코드를 별도 파일에 저장할 수 있습니다.

## 중간 점검: 두 파일(과 두 단계)로 분리됨
처음보다 코드량이 늘었지만 추가된 코드 덕분에 전체 로직을 구성하는 요소 각각이 부각되고, 계산과 출력 형식을 다루는 부분이 분리되었습니다.  
이렇게 모듈화하면 각 부분이 하는 일과 그 부분들이 서로 돌아가는 과정을 파악하기 쉬워집니다.   
모듈화 덕분에 계산 코드를 중복하지 않고도 HTML 버전을 만들 수 있었습니다.

> 간결함이 지혜의 정수일지 몰라도, 프로그래밍에서만큼은 명료함이 진화할 수 있는 소프트웨어의 정수다.

`statement.js`
```js
import createStatementData from './createStatementData';

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) {...}

function htmlStatement(invoice, plays) {
  return renderHTML(createStatementData(invoice, plays));
}
function renderHTML(data) {...}

function usd(aNumber) {...}
```

`createStatement.js`
```js
export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  function enrichPerformance(aPerformance) {...}
  function playFor(aPerformance) {...}
  function amountFor(aPerformance) {...}
  function volumeCreditsFor(aPerformance) {...}
  function totalVolumeCredits() {...}
  function totalAmount() {...}
}
```