import { Form, FormLayout, TextField, Modal } from "@shopify/polaris";
import { useState } from "react";
import { cloneDeep } from "lodash";

export function TabTitle({ metafields, updateMenus, indexs }) {
  const data = metafields.value.children[indexs[0]].name;

  const [active, setActive] = useState(false);
  const [loadingAdd, setLoaingAdd] = useState(false);
  const [loadingDel, setLoaingDel] = useState(false);
  const [name, setName] = useState(data);
  const [index, setIndex] = useState(indexs[0] + 1);

  const activator = <span onClick={() => setActive(true)}>{data}</span>;

  const primaryAction = {
    content: "Save",
    loading: loadingAdd,
    onAction: () => {
      const menus = cloneDeep(metafields);
      const item = menus.value.children[indexs[0]];
      item.id = name;
      item.name = name;
      if (index - 1 !== indexs[0]) {
        let arr = menus.value.children;
        var s = arr[indexs[0]];
        arr.splice(indexs[0], 1);
        arr.splice(index - 1, 0, s);
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
    onAction: () => {
      const menus = cloneDeep(metafields);
      let item = menus.value.children;
      item.splice(indexs[0], 1);
      setLoaingDel(true);
      updateMenus(menus, () => {
        setActive(false);
        setLoaingDel(false);
      });
    },
  };

  return (
    <Modal
      activator={activator}
      title="Edit"
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
              label="index"
              value={index}
              onChange={(value) => setIndex(value)}
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
}
