import {
  Form,
  FormLayout,
  TextField,
  Modal,
  Button,
  Checkbox,
  TextContainer,
} from "@shopify/polaris";
import { CirclePlusMinor } from "@shopify/polaris-icons";
import { MoreText } from "./MoreText";
import { useCallback, useState } from "react";
import { cloneDeep } from "lodash";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";

export function TabImage({ metafields, updateMenus, indexs }) {
  const root = metafields.value.children[indexs[0]];
  let data = root.children;
  if (indexs.length > 1) {
    data = data[indexs[1]].children;
  }

  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const [active, setActive] = useState(false);
  const [loadingAdd, setLoaingAdd] = useState(false);
  const [loadingDel, setLoaingDel] = useState(false);
  const [title, setTitle] = useState("");
  const [form, setForm] = useState({});
  const [i, setI] = useState("");
  const [index, setIndex] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [drag, setDrag] = useState(false);
  const [loadingDrag, setLoaingDrag] = useState(false);

  const updateForm = (key, value) => {
    const newForm = cloneDeep(form);
    newForm[key] = value;
    setForm(newForm);
  };

  const edit = (i) => {
    setTitle("Edit");
    setActive(true);
    setDisabled(false);
    const item = data[i];
    setForm({ ...item.info });
    setIndex(i - 0 + 1);
    setI(i - 0 + 1);
  };

  const add = () => {
    setTitle("Add");
    setActive(true);
    setDisabled(true);
    setForm({});
    setIndex("");
  };

  const dragStart = (i) => {
    setStart(i);
  };

  const dragOver = (i) => {
    setEnd(i);
  };

  const dragEnd = (i) => {
    if (end !== start) {
      setDrag(true);
    }
  };

  const confirmDrag = () => {
    const menus = cloneDeep(metafields);
    let parent = menus.value.children[indexs[0]];
    let item = parent.children;
    if (indexs.length > 1) {
      parent = item[indexs[1]];
      item = parent.children;
    }
    var s = item[start];
    item.splice(start, 1);
    item.splice(end, 0, s);
    item.forEach((tem, i) => {
      tem.id = tem.name = "img_" + (i + 1);
    });
    setLoaingDrag(true);
    updateMenus(menus, () => {
      setDrag(false);
      setLoaingDrag(false);
    });
  };
  const cancelDrag = () => {
    setDrag(false);
  };

  const DragModal = () => {
    return (
      <Modal
        open={drag}
        onClose={() => setDrag(false)}
        title="warnning"
        primaryAction={{
          content: "confirm",
          loading: loadingDrag,
          onAction: confirmDrag,
        }}
        secondaryActions={[
          {
            content: "cancel",
            onAction: cancelDrag,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              是否把第{start + 1}位内容移到第{end + 1}位
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    );
  };

  const primaryAction = {
    content: "Save",
    loading: loadingAdd,
    onAction: () => {
      const menus = cloneDeep(metafields);
      let parent = menus.value.children[indexs[0]];
      let item = parent.children;
      if (indexs.length > 1) {
        parent = item[indexs[1]];
        item = parent.children;
      }
      if (title === "Add") {
        const newForm = {
          id: "",
          name: "",
          parentId: parent.id,
          info: {
            hot: "",
            subTitle: "",
            ...form,
          },
          children: "",
        };
        if (index) {
          item.splice(index - 1, 0, newForm);
        } else {
          item.push(newForm);
        }
        item.forEach((tem, i) => {
          tem.id = tem.name = "img_" + (i + 1);
        });
      } else {
        Object.assign(item[i - 1].info, form);
        if (index !== i) {
          var s = item[i - 1];
          item.splice(i - 1, 1);
          item.splice(index - 1, 0, s);
          item.forEach((tem, i) => {
            tem.id = tem.name = "img_" + (i + 1);
          });
        }
      }
      setLoaingAdd(true);
      updateMenus(menus, () => {
        setActive(false);
        setLoaingAdd(false);
      });
    },
  };

  const secondaryActions = {
    content: "Delete",
    loading: loadingDel,
    destructive: true,
    disabled: disabled,
    onAction: () => {
      const menus = cloneDeep(metafields);
      let parent = menus.value.children[indexs[0]];
      let item = parent.children;
      if (indexs.length > 1) {
        parent = item[indexs[1]];
        item = parent.children;
      }
      item.splice(index, 1);
      item.forEach((tem, i) => {
        tem.id = tem.name = "img_" + (i + 1);
      });
      setLoaingDel(true);
      updateMenus(menus, () => {
        setActive(false);
        setLoaingDel(false);
      });
    },
  };

  const labelAction = {
    content: "upload file",
    onAction: () => {
      redirect.dispatch(Redirect.Action.ADMIN_PATH, {
        path: "/settings/files",
        newContext: true,
      });
    },
  };
  return (
    <>
      <ul>
        {data &&
          data.map((item, i) => {
            return (
              <li
                key={i}
                onClick={() => edit(i)}
                draggable
                onDragStart={() => dragStart(i)}
                onDragOver={() => dragOver(i)}
                onDragEnd={() => dragEnd()}
              >
                <img src={item.info.imageUrl} />
                <p>{item.info.title}</p>
                {item.info.new && (
                  <div className="tag">
                    <svg
                      width="35"
                      height="47"
                      viewBox="0 0 35 47"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 44.9922V0H35V44.9922C35 46.4214 33.5443 47.3893 32.2263 46.8365L18.2737 40.9834C17.7788 40.7758 17.2212 40.7758 16.7263 40.9834L2.77367 46.8365C1.45572 47.3893 0 46.4214 0 44.9922Z"
                        fill="#21D2C5"
                      />
                    </svg>
                    <span>{item.info.newText}</span>
                  </div>
                )}
              </li>
            );
          })}
        {data.length < 4 && (
          <li className="item-add">
            <Button plain monochrome icon={CirclePlusMinor} onClick={add}>
              Add
            </Button>
          </li>
        )}
        {root.checkMoreText && (
          <MoreText
            metafields={metafields}
            updateMenus={updateMenus}
            indexs={indexs}
          />
        )}
      </ul>
      <Modal
        title={title}
        open={active}
        onClose={() => setActive(false)}
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
      >
        <Modal.Section>
          <Form>
            <FormLayout>
              <TextField
                label="title"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
              />
              <TextField
                label="imageUrl"
                labelAction={labelAction}
                value={form.imageUrl}
                onChange={(value) => updateForm("imageUrl", value)}
              />
              <TextField
                label="href"
                value={form.href}
                onChange={(value) => updateForm("href", value)}
              />
              <Checkbox
                label="new"
                checked={form.new}
                onChange={(value) => updateForm("new", value)}
                helpText="show newText when checked"
              />
              <TextField
                label="newText"
                value={form.newText}
                onChange={(value) => updateForm("newText", value)}
              />
              {/* {title === "Add" && ( */}
              <TextField
                label="index"
                value={index}
                onChange={(value) => setIndex(value)}
                helpText="add to index item.(optional, default add to last)"
              />
              {/* )} */}
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
      <DragModal />
    </>
  );
}
