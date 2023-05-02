import { Form, FormLayout, TextField, Modal, Button } from "@shopify/polaris";
import { CirclePlusMinor } from "@shopify/polaris-icons";
import { useState } from "react";
import { cloneDeep } from "lodash";

export function MenuList({ metafields, updateMenus, indexs }) {

  const data = metafields.value.children[indexs[0]].children;

  const [active, setActive] = useState(false);
  const [loadingAdd, setLoaingAdd] = useState(false);
  const [loadingDel, setLoaingDel] = useState(false);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [href, setHref] = useState("");
  const [index, setIndex] = useState("");
  const [disabled, setDisabled] = useState(false);

  const edit = (i) => {
    setTitle("Edit");
    setActive(true);
    setDisabled(false);
    const item = data[i];
    setIndex(i);
    setName(item.name);
    setHref(item.href);
  };

  const add = () => {
    setTitle("Add");
    setActive(true);
    setDisabled(true);
    setIndex("");
    setName("");
    setHref("");
  };

  const primaryAction = {
    content: "Save",
    loading: loadingAdd,
    onAction: () => {
      const menus = cloneDeep(metafields);
      const parent = menus.value.children[indexs[0]];
      const item = parent.children;
      const form = {
        id: name,
        name,
        href,
        parentId: parent.id,
        type: "link"
      };
      if (title === "Add") {
        if (index) {
          item.splice(index-1, 0, form);
        } else {
          item.push(form);
        }
      } else {
        item[index] = form;
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
      item.splice(index, 1)
      setLoaingDel(true);
      updateMenus(menus, () => {
        setActive(false);
        setLoaingDel(false);
      });
    }
  }
  return (
    <>
      <ul>
        {data &&
          data.map((item, i) => {
            return (
              <li key={i} onClick={() => edit(i)}>
                {item.name}
              </li>
            );
          })}
        <li className="item-add">
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
                value={name}
                onChange={(value) => setName(value)}
              />
              <TextField
                label="href"
                value={href}
                onChange={(value) => setHref(value)}
              />
              {title === "Add" && (
                <TextField
                  label="index"
                  value={index}
                  onChange={(value) => setIndex(value)}
                  helpText="add to index item.(optional, default add to last)"
                />
              )}
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </>
  );
}
