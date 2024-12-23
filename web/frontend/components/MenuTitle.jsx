import { Form, FormLayout, TextField, Modal } from "@shopify/polaris";
import { useState } from "react";
import { cloneDeep } from "lodash";

export function MenuTitle({ metafields, updateMenus, indexs }) {

  const data = metafields.value.children[indexs[0]].name;

  const [active, setActive] = useState(false);
  const [loading, setLoaing] = useState(false);
  const [name, setName] = useState(data);

  const activator = <h3 onClick={() => setActive(true)}>{data}</h3>;

  const primaryAction = {
    content: "Save",
    loading,
    onAction: () => {
      const menus = cloneDeep(metafields);
      menus.value.children[indexs[0]].name = name;
      setLoaing(true);
      updateMenus(menus, () => {
        setActive(false);
        setLoaing(false);
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
    >
      <Modal.Section>
        <Form>
          <FormLayout>
            <TextField
              label="name"
              value={name}
              onChange={(value) => setName(value)}
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
}
