import { ConnectionHandler } from "./connection-handler";

export class ActivityHandler {
  static contactFieldsMap = {}; // const
  static contactFields = []; // let

  static recordTypeSelected = null; // let // initial val

  static addRecordTypeListHandler() {
    const recordTypeListElem = document.getElementById("record-type-list");
    if (!recordTypeListElem) {
      return;
    }

    recordTypeListElem.addEventListener(
      "click",
      (ev) => {
        const liElem = ev.target.closest("li");
        this.recordTypeSelected = liElem?.dataset?.id || null;
        if (!this.recordTypeSelected) {
          return;
        }

        [...recordTypeListElem.getElementsByTagName("li")].forEach((liElem) => {
          liElem.classList.remove("slds-is-selected");
        });
        liElem.classList.add("slds-is-selected");

        ConnectionHandler.toggleButtonsState("step1");
      },
      false
    );
  }

  static async prepareContactList() {
    this.contactFields = (await this.getContactFields()) || [];
    const fragment = document.createDocumentFragment();

    this.contactFields.forEach(function (contactField) {
      const li = document.createElement("li");
      li.textContent = contactField.label;
      li.dataset.name = contactField.name;
      li.setAttribute("role", "menuitem");
      li.classList.add("slds-dropdown__item");
      fragment.appendChild(li);
    });

    const contactFieldListElem = document.getElementById("contact-field-list");
    if (contactFieldListElem) {
      contactFieldListElem.addEventListener(
        "click",
        (ev) => {
          if (ev.target.tagName !== "LI") {
            return;
          }
          const dataName = ev.target.dataset.name;
          this.contactFieldsMap[dataName] = !this.contactFieldsMap[dataName];
          ev.target.classList.toggle("slds-is-selected");
          ConnectionHandler.toggleButtonsState("step2");
        },
        false
      );
      contactFieldListElem.appendChild(fragment);
    }
  }

  static async getContactFields() {
    const rawResponse = await fetch("/contact/fields", {
      method: "GET",
      mode: "same-origin", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
    });
    if (!rawResponse.ok) {
      throw Error(rawResponse.statusText);
    }
    return rawResponse.json(); // parses JSON response into native JavaScript objects
  }
}

// /**
//  * @deprecated
//  *
//  * ```js
//  * postData().then(
//  *   (res) => {
//  *     console.log(res);
//  *   },
//  *   (err) => {
//  *     console.log(err);
//  *   },
//  * );
//  * ```
//  *
//  */
// async function postData() {
//   // Default options are marked with *
//   const rawResponse = await fetch(
//     "https://login.salesforce.com/services/oauth2/token",
//     {
//       method: "POST",
//       mode: "cors", // no-cors, *cors, same-origin
//       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//       credentials: "same-origin", // include, *same-origin, omit
//       headers: {
//         // 'Access-Control-Allow-Origin': '*', // response header
//         "Content-Type": "application/x-www-form-urlencoded", // ;charset=UTF-8
//       },
//       redirect: "follow", // manual, *follow, error
//       referrerPolicy: "no-referrer", // no-referrer, *client
//       body: new URLSearchParams({
//         grant_type: "password",
//         client_id: "",
//         client_secret: "",
//         username: "",
//         password: "",
//       }),
//     }
//   );
//   // to work in Chrome with localhost make shortcut:
//   // chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
//   if (!rawResponse.ok) {
//     throw Error(rawResponse.statusText);
//   }
//   return await rawResponse.json(); // parses JSON response into native JavaScript objects
// }
