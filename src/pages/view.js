import XBytes from "xbytes";
import Tree from "@/components/Tree.vue";
import Vue from "vue";
import { hashCode } from "@/utils/misc";

const TreeVM = Vue.extend(Tree);

function folderTreeFromNodeList(fileNodeList) {
  const map = {};
  const list = [];

  for (let i = 0, len = fileNodeList.length; i < len; i++) {
    const fileNode = fileNodeList[i];

    const fileSizeNode = fileNode.querySelector(".bt_file_size");
    const nodeText = fileNode.innerText;

    let fileSizeStr;

    if (fileSizeNode) {
      fileSizeStr = fileSizeNode.innerText.trim();
    }

    let filePath;
    let fileBytes = 0;

    if (fileSizeStr) {
      const bytes = fileSizeStr.replace(/(\d+)bytes?/i, "$1");
      if (!isNaN(+bytes)) {
        fileBytes = +bytes;
      } else {
        fileBytes = XBytes.parseSize(fileSizeStr, { iec: false });
      }
      filePath = nodeText.substring(0, nodeText.indexOf(fileSizeStr)).trim();
    } else {
      filePath = nodeText.trim();
    }

    if (!filePath) {
      filePath = `No. ${i + 1} - Unknown filename`;
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
          size: level === sLen ? fileBytes : 0,
          children: level === sLen ? null : [],
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

export function mountFileListElement(el, title) {
  const fileListNode = el.querySelector("ul");
  const fileItemNodeList = el.querySelectorAll("ul > li");

  if (!fileListNode || fileItemNodeList.length <= 0) {
    return;
  }

  const folders = folderTreeFromNodeList(fileItemNodeList);

  if (folders.length <= 0) {
    return;
  }

  const tree = new TreeVM({
    propsData: {
      folders:
        (folders.length > 1 || folders[0].size) && title
          ? [
              {
                key: 0,
                parentKey: -1,
                name: title,
                children: folders,
              },
            ]
          : folders,
    },
  });

  tree.$mount(fileListNode);
}
