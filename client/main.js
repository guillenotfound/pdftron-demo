import WebViewer from "@pdftron/webviewer";

WebViewer(
  {
    backendType: "asm",
    path: "/public/webviewer",
    webviewerServerURL: "http://0.0.0.0:8090",
    fullAPI: true,
  },
  document.getElementById("viewer")
).then((instance) => {
  const { UI, Core } = instance;
  const { documentViewer } = Core;

  document.getElementById("file-selector").onchange = (e) => {
    asyncLoadDocument(e.target.value);
  };

  function asyncLoadDocument(url) {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        UI.loadDocument(blob, {
          extension: url.split(".").pop().toLowerCase(),
        });
      });
  }

  async function getPDFLink() {
    return documentViewer
      .getDocument()
      .getPrintablePDF()
      .then((res) => res.url);
  }

  function handlePDFPrint() {
    getPDFLink()
      .then((url) => {
        console.log(url);
        const event = new CustomEvent("docwillprint", { detail: url });
        document.dispatchEvent(event);
      })
      .catch(console.error);
  }

  UI.updateElement("printButton", { onClick: () => handlePDFPrint() });

  UI.setTheme("dark");
  UI.disableFeatures([UI.Feature.FilePicker]);

  UI.setZoomLevel(1);

  documentViewer.addEventListener("documentLoaded", () => {
    // call methods relating to the loaded document
    documentViewer
      .getDocument()
      .getMetadata()
      .then((data) => {
        document.title = data.title || documentViewer.getDocument().filename;
      });
  });
});

// import {WebViewerServer} from './WVSApiWrapper'

// var wvs = WebViewerServer({
//   serverUrl: "http://0.0.0.0:8090"
// });

// wvs.getPDF({uri: 'http://webviewer-client:5173/sample.docx'}).then(console.log)
