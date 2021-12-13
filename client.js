import fetch from "node-fetch";
import yaml from "yaml";
import readlineSync from "readline-sync";

const url = "http://localhost:8080";

let sessionId = null;

const getUserInput = (fields) => {
  let res = {};
  fields.forEach((field) => {
    res[field] = readlineSync.question(field + ": ");
  });
  return res;
};

const printResult = (result) => {
  const doc = new yaml.Document();
  doc.contents = result;
  console.log();
  console.log(doc.toString());
};

const commands = [
  {
    command: "음반 조회",
    routine: async () => {
      let fields = getUserInput(["albumId"]);
      let res = await fetch(url + `/disco/album/${fields.albumId}`);
      printResult(await res.json());
    },
  },
  {
    command: "음반 검색",
    routine: async () => {
      let fields = getUserInput(["searchType", "searchTerm"]);
      let res = await fetch(
        url +
          `/disco/search?type=${fields.searchType}&term=${fields.searchTerm}`
      );
      printResult(await res.json());
    },
  },
  {
    command: "음반 기여 요청",
    routine: async () => {
      let fields = getUserInput([
        "type",
        "albumId",
        "title",
        "artist",
        "description",
        "notes",
      ]);
      let res = await fetch(url + `/disco/contribution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
        body: JSON.stringify(fields),
      });
      printResult(await res.json());
    },
  },
  {
    command: "음반 기여 목록 조회",
    routine: async () => {
      let res = await fetch(url + `/disco/contributions`, {
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
      });
      printResult(await res.json());
    },
  },
  {
    command: "음반 기여 조회",
    routine: async () => {
      let fields = getUserInput(["request_id"]);
      let res = await fetch(url + `/disco/contribution/${fields.request_id}`, {
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
      });
      printResult(await res.json());
    },
  },
  {
    command: "상품 등록",
    routine: async () => {
      let fields = getUserInput([
        "albumId",
        "media",
        "description",
        "condition",
        "price",
      ]);
      let res = await fetch(url + `/marketplace/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
        body: JSON.stringify(fields),
      });
      printResult(await res.json());
    },
  },
  {
    command: "상품 조회",
    routine: async () => {
      let fields = getUserInput(["itemId"]);
      let res = await fetch(url + `/marketplace/item/${fields.itemId}`, {
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
      });
      printResult(await res.json());
    },
  },
  {
    command: "상품 삭제",
    routine: async () => {
      let fields = getUserInput(["itemId"]);
      let res = await fetch(url + `/marketplace/item/${fields.itemId}`, {
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
      });
      printResult(await res.json());
    },
  },
  {
    command: "판매자 상품 목록 조회",
    routine: async () => {
      let res = await fetch(url + `/marketplace/items`, {
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
      });
      printResult(await res.json());
    },
  },
  {
    command: "상품 검색",
    routine: async () => {
      let fields = getUserInput(["searchType", "searchTerm"]);
      let res = await fetch(
        url +
          `/marketplace/search?type=${fields.searchType}&term=${fields.searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
            SessionId: sessionId,
          },
        }
      );
      printResult(await res.json());
    },
  },
  {
    command: "구매 요청 생성",
    routine: async () => {
      let fields = getUserInput(["itemId", "message"]);
      let res = await fetch(
        url +
          `/marketplace/order_request?itemId=${fields.itemId}&message=${fields.message}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            SessionId: sessionId,
          },
        }
      );
      printResult(await res.json());
    },
  },
  {
    command: "구매 요청 처리",
    routine: async () => {
      let fields = getUserInput(["requestId", "actionType"]);
      let res = await fetch(
        url +
          `/markeplace/order_request/${fields.requestId}?action=${fields.actionType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            SessionId: sessionId,
          },
        }
      );
      printResult(await res.json());
    },
  },
  {
    command: "판매자 구매 요청 목록 조회",
    routine: async () => {
      let res = await fetch(url + `/marketplace/order_requests/seller`, {
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
      });
      printResult(await res.json());
    },
  },
  {
    command: "구매자 구매 요청 목록 조회",
    routine: async () => {
      let res = await fetch(url + `/marketplace/order_requests/buyer`, {
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
      });
      printResult(await res.json());
    },
  },
  {
    command: "로그인",
    routine: async () => {
      let fields = getUserInput(["username", "password"]);
      let res = await fetch(url + `/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        console.log("Hi, " + fields.username);
        sessionId = await res.text();
      } else console.log("Authentication Failed");
    },
  },
  {
    command: "회원 가입",
    routine: async () => {
      let fields = getUserInput(["username", "password", "email"]);
      let res = await fetch(url + `/account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        console.log("Hi, " + fields.username);
        sessionId = await res.text();
      } else console.log("Authentication Failed");
    },
  },
  {
    command: "회원 정보 수정",
    routine: async () => {
      let fields = getUserInput(["password", "email"]);
      let res = await fetch(url + `/account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
        body: JSON.stringify(fields),
      });
      printResult(await res.json());
    },
  },
  {
    command: "음반 기여 승인",
    routine: async () => {
      let fields = getUserInput(["request_id"]);
      let res = await fetch(
        url + `/admin/contribute/approve/${fields.request_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            SessionId: sessionId,
          },
          body: JSON.stringify(fields),
        }
      );
      printResult(await res.json());
    },
  },
  {
    command: "음반 기여 거절",
    routine: async () => {
      let fields = getUserInput(["request_id"]);
      let res = await fetch(
        url + `/admin/contribute/deny/${fields.request_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            SessionId: sessionId,
          },
          body: JSON.stringify(fields),
        }
      );
      printResult(await res.json());
    },
  },
  {
    command: "관리자 상품 삭제",
    routine: async () => {
      let fields = getUserInput(["itemId"]);
      let res = await fetch(url + `/admin/marketplace/item/${fields.itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
        body: JSON.stringify(fields),
      });
      printResult(await res.json());
    },
  },
  {
    command: "회원 삭제",
    routine: async () => {
      let fields = getUserInput(["username"]);
      let res = await fetch(url + `/admin/account/${fields.username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
        body: JSON.stringify(fields),
      });
      printResult(await res.json());
    },
  },
  {
    command: "회원 권한 변경",
    routine: async () => {
      let fields = getUserInput(["username", "role"]);
      let res = await fetch(
        url + `/admin/account/${fields.username}?role=${fields.role}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            SessionId: sessionId,
          },
          body: JSON.stringify(fields),
        }
      );
      printResult(await res.json());
    },
  },
  {
    command: "회원 목록 조회",
    routine: async () => {
      let res = await fetch(url + `/admin/accounts`, {
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
      });
      printResult(await res.json());
    },
  },
  {
    command: "관리자 기여 목록 조회",
    routine: async () => {
      let res = await fetch(url + `/admin/contributions`, {
        headers: {
          "Content-Type": "application/json",
          SessionId: sessionId,
        },
      });
      printResult(await res.json());
    },
  },
];

async function main() {
  while (true) {
    const cmd = readlineSync.question("command: ");
    for (let i in commands) {
      if (commands[i].command === cmd) {
        await commands[i].routine();
      }
    }
  }
}

main();
