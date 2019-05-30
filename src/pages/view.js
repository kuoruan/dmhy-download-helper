export function mountFileListElement(el, onError) {
  const fileNodeList = el.querySelectorAll("li");

  for (let i = 0, len = fileNodeList.length; i < len; i++) {
    const fileNode = fileNodeList[i];
    const fileSizeNode = fileNode.querySelector(".bt_file_size");
    let fileSize;

    if (fileSizeNode) {
      fileSize = fileSizeNode.innerText.trim();
    }

    const nodeText = fileNode.innerText;
    let filePath;
    if (fileSize) {
      filePath = nodeText.substring(0, nodeText.indexOf(fileSize)).trim();
    } else {
      filePath = nodeText.trim();
    }

    console.log(filePath);
  }

  if (!fileNodeList.length) {
    onError();
  }
}
