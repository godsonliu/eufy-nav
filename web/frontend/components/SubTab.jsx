import {
  Form,
  FormLayout,
  TextField,
  Modal,
  Button,
  TextContainer,
} from "@shopify/polaris";
import { CirclePlusMinor } from "@shopify/polaris-icons";
import { TabImage } from "./TabImage";
import { useState } from "react";
import { cloneDeep } from "lodash";

export function SubTab({ metafields, updateMenus, indexs }) {
  const data = metafields.value.children[indexs[0]].children;

  const [active, setActive] = useState(false);
  const [loadingAdd, setLoaingAdd] = useState(false);
  const [loadingDel, setLoaingDel] = useState(false);
  const [title, setTitle] = useState("");
  const [form, setForm] = useState({});
  const [i, setI] = useState("");
  const [index, setIndex] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [subIndex, setSubIndex] = useState(0);
  const [isDrag, setIsDrag] = useState(false);
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
    setForm({ ...item });
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
    setIsDrag(true);
  };

  const dragOver = (i) => {
    setEnd(i);
  };

  const dragEnd = (i) => {
    if (end !== start) {
      setDrag(true);
    }
    setIsDrag(false);
  };

  const confirmDrag = () => {
    const menus = cloneDeep(metafields);
    const parent = menus.value.children[indexs[0]];
    const item = parent.children;
    var s = item[start];
    item.splice(start, 1);
    item.splice(end, 0, s);
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
      const parent = menus.value.children[indexs[0]];
      const item = parent.children;
      const newForm = {
        id: form.name,
        parentId: parent.id,
        type: "image",
        children: [],
        ...form,
      };
      if (title === "Add") {
        if (index) {
          item.splice(index - 1, 0, newForm);
        } else {
          item.push(newForm);
        }
      } else {
        item[i - 1] = form;
        if (index !== i) {
          var s = item[i - 1];
          item.splice(i - 1, 1);
          item.splice(index - 1, 0, s);
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
      const parent = menus.value.children[indexs[0]];
      const item = parent.children;
      item.splice(index, 1);
      setLoaingDel(true);
      updateMenus(menus, () => {
        setActive(false);
        setLoaingDel(false);
      });
    },
  };

  return (
    <>
      <ul className="sub-data-tab">
        {data &&
          data.map((tem, i) => (
            <li
              className={subIndex === i ? "active" : ""}
              key={i}
              onMouseEnter={() => setSubIndex(i)}
              draggable
              onDragStart={() => dragStart(i)}
              onDragOver={() => dragOver(i)}
              onDragEnd={() => dragEnd()}
            >
              <span onClick={() => edit(i)}>{tem.name}</span>
              {!isDrag && (
                <TabImage
                  metafields={metafields}
                  updateMenus={updateMenus}
                  indexs={[...indexs, i]}
                />
              )}
            </li>
          ))}
        <li>
          <Button plain monochrome icon={CirclePlusMinor} onClick={add}>
            Add
          </Button>
        </li>
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
                label="name"
                value={form.name}
                onChange={(value) => updateForm("name", value)}
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
