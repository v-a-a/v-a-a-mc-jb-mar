// Takes the config and returns the config with the fully qualified paths based on the domain that is hosting it.
module.exports = function configJSON(req) {
  const host = req?.headers?.host;
  console.log(`host: ${host}`);

  // const appKey = process.env.UNIQUE_KEY; // can be detected automatically

  return {
    workflowApiVersion: "1.1",
    // key: appKey || void 0,
    metaData: {
      // the location of our icon file
      icon: `images/icon.svg`,
      category: "customer",
    },
    // For Custom Activity this must say, "REST"
    type: "REST", // 'RESTDECISION',
    lang: {
      // Internationalize your language here!
      "en-US": {
        name: "MC JB Custom Activity Filter Contact",
        description:
          "Marketing Cloud Journey Builder - Custom Activity Filter Contact Example",
        step1Label: "Configure Activity",
      },
    },
    // arguments: {
    //   execute: {
    //     inArguments: [],
    //     outArguments: [],
    //     // Fill in the host with the host that this is running on.
    //     // It must run under HTTPS
    //     url: `https://${host}/execute`,
    //     body: "",
    //     format: "json",
    //     useJwt: false,
    //     timeout: 2000,
    //   },
    // },
    // configurationArguments: {
    //   // applicationExtensionKey: appKey || void 0,
    //   save: {
    //     url: `https://${host}/save`,
    //   },
    //   publish: {
    //     url: `https://${host}/publish`,
    //   },
    //   validate: {
    //     url: `https://${host}/validate`,
    //   },
    //   stop: {
    //     url: `https://${host}/stop`,
    //   },
    // },
    wizardSteps: [
      {
        label: "Select Contact Record Type",
        key: "step1",
      },
      {
        label: "Select Contact Fields",
        key: "step2",
      },
    ],
    userInterfaces: {
      configModal: {
        height: 600,
        width: 800,
        fullscreen: false,
      },
    },
    // schema: {
    //   arguments: {
    //     execute: {
    //       inArguments: [],
    //       outArguments: [],
    //     },
    //   },
    // },
    // outcomes: [
    //   {
    //     arguments: {
    //       branchResult: "no_error",
    //     },
    //     metaData: {
    //       label: "No Error",
    //     },
    //   },
    //   /*
    //   {
    //     arguments: {
    //       branchResult: "invalid_code",
    //     },
    //     metaData: {
    //       label: "Invalid Code",
    //     }
    //   }
    //   */
    // ],
  };
};
