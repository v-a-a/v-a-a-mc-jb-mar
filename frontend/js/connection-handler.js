import Postmonger from "postmonger";

import { ActivityHandler } from "./activity-handler";

export class ConnectionHandler {
  static connection;
  static eventDefinitionKey = null; // let
  // let tokens = null;

  /**
   * like constructor
   */
  static start() {
    this.connection = new Postmonger.Session();
    this.listenDomContentLoaded();
  }

  static listenDomContentLoaded() {
    document.addEventListener("DOMContentLoaded", () => {
      // Journey Builder will trigger "initActivity" after it receives the "ready" event
      this.connection.on("initActivity", this.initialize.bind(this));
      // this.connection.on('requestedInteractionDefaults', requestedInteractionDefaults);
      // this.connection.on('requestedInteraction', requestedInteraction);

      this.connection.on("gotoStep", this.save.bind(this));
      this.connection.on("clickedNext", this.nextStep.bind(this));
      this.connection.on("clickedBack", this.prevStep.bind(this));

      // We're all set! let's signal Journey Builder
      // that we're ready to receive the activity payload...

      // Tell the parent iFrame that we are ready.
      this.connection.trigger("ready");

      // Tell the parent iFrame we want the Interaction Defaults
      this.connection.trigger("requestInteractionDefaults");

      // Tell the parent iFrame we want the Interaction
      this.connection.trigger("requestInteraction");

      // this.connection.trigger("requestTokens");
      // this.connection.on("requestedTokens", function (requestedTokens) {
      //   this.tokens = requestedTokens; // with bind(this)
      // });

      this.connection.trigger("requestTriggerEventDefinition");
      this.connection.on(
        "requestedTriggerEventDefinition",
        this.requestTriggerEventDefinition.bind(this)
      );

      this.connection.trigger("requestSchema");
      this.connection.on("requestedSchema", this.requestSchema.bind(this));
    });
  }

  static initialize(payload) {
    if (!payload) {
      return;
    }

    const hasInArguments = Boolean(
      payload["arguments"] &&
        payload["arguments"].execute &&
        payload["arguments"].execute.inArguments &&
        payload["arguments"].execute.inArguments.length > 0
    );

    const inArguments = hasInArguments
      ? payload["arguments"].execute.inArguments
      : {};

    console.log("Has In arguments: " + JSON.stringify(inArguments));

    // $.each(inArguments, function (index, inArgument) {
    //     $.each(inArgument, function (key, val) {})
    // });

    this.connection.trigger("updateButton", {
      button: "next",
      text: "next",
      visible: true,
      enabled: false,
    });
  }

  static requestTriggerEventDefinition(eventDefinitionModel) {
    if (!eventDefinitionModel) {
      return;
    }
    this.eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
    console.log("*** eventDefinitionModel ***", eventDefinitionModel);
  }

  static requestSchema(data) {
    console.log("*** Schema ***", data["schema"]);
  }

  static async save(wizardStep) {
    if (!wizardStep.key) {
      return;
    }

    this.toggleButtonsState(wizardStep.key);

    let isLastStep = false;

    const radioElem = document.getElementById(wizardStep.key);
    if (radioElem) {
      if (wizardStep.key === "step2" && radioElem.checked) {
        isLastStep = true;
      }
      radioElem.checked = true;
    }

    // load data for step 2
    if (
      wizardStep.key === "step2" &&
      !isLastStep &&
      !ActivityHandler.contactFields.length
    ) {
      await ActivityHandler.prepareContactList();
    }

    if (isLastStep) {
      this.updateActivity();
    }
  }

  static updateActivity() {
    // NOTE: last step in config.json
    const url = window.location.protocol + "//" + window.location.host;
    const payload = {
      // "name": "",
      // "id": null,
      // "key": "REST-1",
      arguments: {
        execute: {
          inArguments: [
            // {{Contact.Default.FirstName}} - error
            // {{Contact.Attribute.Person.FirstName}} - empty
            // {{InteractionDefaults.FirstName}} - error
            // {
            //   ContactKey: "{{Contact.Key}}",
            // },
            // NOTE: these fields can have other names in DataExtension
            {
              RecordTypeId: ActivityHandler.recordTypeSelected,
            },
            {
              FirstName: `{{Event."${this.eventDefinitionKey}".FirstName}}`,
            },
            {
              LastName: `{{Event."${this.eventDefinitionKey}".LastName}}`,
            },
            ...Object.keys(ActivityHandler.contactFieldsMap)
              .filter((item) => ActivityHandler.contactFieldsMap[item])
              .reduce(
                (acc, contactField) => [
                  ...acc,
                  {
                    [contactField]: `{{Event."${this.eventDefinitionKey}".${contactField}}}`,
                  },
                ],
                []
              ),
          ],
          outArguments: [],
          // verb: "POST",
          // Fill in the host with the host that this is running on.
          // It must run under HTTPS
          url: `${url}/execute`,
          // body: '',
          useJwt: true,
        },
      },
      configurationArguments: {
        publish: {
          url: `${url}/publish`,
          // body: '',
          useJwt: true,
        },
      },
      metaData: {
        // the location of our icon file
        // icon: 'images/icon.svg',
        // category: 'message',
        // iconSmall: null,
        isConfigured: true,
      },
      // editable: true,
      // outcomes: [
      //     {
      //         next: 'WAITBYDURATION-1',
      //     },
      // ],
      // errors: [],
    };
    this.connection.trigger("updateActivity", payload);
  }

  static toggleButtonsState(wizardStepKey) {
    switch (wizardStepKey) {
      case "step1": {
        this.toggleButtonRecordType();
        break;
      }
      case "step2": {
        this.toggleButtonContactFields();
        break;
      }
    }
  }

  static toggleButtonRecordType() {
    this.connection.trigger("updateButton", {
      button: "next",
      enabled: Boolean(ActivityHandler.recordTypeSelected),
    });
  }

  static toggleButtonContactFields() {
    const contactFieldsSelected = Object.keys(
      ActivityHandler.contactFieldsMap
    ).filter((item) => ActivityHandler.contactFieldsMap[item]).length;
    this.connection.trigger("updateButton", {
      button: "next",
      enabled: Boolean(contactFieldsSelected),
    });
  }

  static prevStep() {
    this.connection.trigger("prevStep");
  }

  static nextStep() {
    this.connection.trigger("nextStep");
  }
}
