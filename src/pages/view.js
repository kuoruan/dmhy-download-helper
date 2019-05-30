import Vue from "vue";
import Tree from "@/components/Tree.vue";
import { hashCode } from "@/utils";

const TreeVM = Vue.extend(Tree);

function folderTreeFromElement(listElement) {
  const fileNodeList = listElement.querySelectorAll("li");

  const map = {};
  const list = [];

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

    let slice = filePath.split("/");

    let parentKey = 0;
    for (let j = 0, sLen = slice.length; j < sLen; j++) {
      let fileName = slice[j];
      let level = j + 1;

      let baseName = filePath.substring(
        0,
        filePath.indexOf(fileName) + fileName.length
      );
      let key = hashCode(baseName);

      if (!map[key]) {
        let file = {
          key: key,
          parentKey: parentKey,
          name: fileName,
          level: level,
          size: level === sLen ? fileSize : null,
          children: level === sLen ? null : []
        };
        map[key] = file;
        list.push(file);
      }

      parentKey = key;
    }
  }

  const root = [];
  for (let i = 0, len = list.length; i < len; i++) {
    let file = list[i];

    if (!file.parentKey) {
      root.push(file);
    } else {
      map[file.parentKey].children.push(file);
    }
  }

  return root;
}

export function mountFileListElement(el, onError) {
  const folders = folderTreeFromElement(el);

  if (folders.length <= 0) {
    onError();
    return;
  }

  const tree = new TreeVM({
    propsData: {
      folders: folders,
      onError: onError
    }
  });

  tree.$mount(el);
}
