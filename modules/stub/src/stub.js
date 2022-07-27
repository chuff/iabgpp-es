(function () {
  const makeStub = () => {
    const GPP_LOCATOR_NAME = "__gppLocator";
    const queue = [];
    const currentWindow = window;
    let frameLocator = currentWindow;
    let cmpFrame;

    function addFrame() {
      const doc = currentWindow.document;
      const otherCMP = !!currentWindow.frames[GPP_LOCATOR_NAME];

      if (!otherCMP) {
        if (doc.body) {
          const iframe = doc.createElement("iframe");

          iframe.style.cssText = "display:none";
          iframe.name = GPP_LOCATOR_NAME;
          doc.body.appendChild(iframe);
        } else {
          setTimeout(addFrame, 5);
        }
      }

      return !otherCMP;
    }

    function gppHandler(...args) {
      if (!args.length) {
        /**
         * shortcut to get the queue when the full CMP
         * implementation loads; it can call gppHandler()
         * with no arguments to get the queued arguments
         */

        return queue;
      } else if (args[0] === "ping") {
        /**
         * Only supported method; give PingReturn
         * object as response
         */
        if (typeof args[2] === "function") {
          args[2]({
            cmpLoaded: false,
            cmpStatus: "stub",
          });
        }
      } else {
        /**
         * some other method, just queue it for the
         * full CMP implementation to deal with
         */
        queue.push(args);
      }
    }

    function postMessageEventHandler(event) {
      const msgIsString = typeof event.data === "string";
      let json = {};

      if (msgIsString) {
        try {
          /**
           * Try to parse the data from the event.  This is important
           * to have in a try/catch because often messages may come
           * through that are not JSON
           */
          json = JSON.parse(event.data);
        } catch (ignore) {}
      } else {
        json = event.data;
      }

      const payload = typeof json === "object" ? json.__gppCall : null;

      if (payload) {
        window.__gpp(
          payload.command,
          payload.version,
          function (retValue, success) {
            let returnMsg = {
              __gppReturn: {
                returnValue: retValue,
                success: success,
                callId: payload.callId,
              },
            };

            if (event && event.source && event.source.postMessage) {
              event.source.postMessage(msgIsString ? JSON.stringify(returnMsg) : returnMsg, "*");
            }
          },
          payload.parameter
        );
      }
    }

    /**
     * Iterate up to the top window checking for an already-created
     * "__gpplLocator" frame on every level. If one exists already then we are
     * not the master CMP and will not queue commands.
     */
    while (frameLocator) {
      try {
        if (frameLocator.frames[GPP_LOCATOR_NAME]) {
          cmpFrame = frameLocator;
          break;
        }
      } catch (ignore) {}

      // if we're at the top and no cmpFrame
      if (frameLocator === currentWindow.top) {
        break;
      }

      // Move up
      frameLocator = frameLocator.parent;
    }

    if (!cmpFrame) {
      // we have recur'd up the windows and have found no __gppLocator frame
      addFrame();
      currentWindow.__gpp = gppHandler;
      currentWindow.addEventListener("message", postMessageEventHandler, false);
    }
  };

  if (typeof module !== "undefined") {
    module.exports = makeStub;
  } else {
    makeStub();
  }
})();
