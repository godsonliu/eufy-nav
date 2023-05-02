import { Form, FormLayout, TextField, Modal } from "@shopify/polaris";
import { useState } from "react";
import { cloneDeep } from "lodash";

export function MoreText({ metafields, updateMenus, indexs }) {
  const data = metafields.value.children[indexs[0]];

  const [active, setActive] = useState(false);
  const [loading, setLoaing] = useState(false);
  const [form, setForm] = useState({});

  const updateForm = (key, value) => {
    const newForm = cloneDeep(form);
    newForm[key] = value;
    setForm(newForm);
  };

  const edit = () => {
    setActive(true);
    setForm({
      checkMoreText: data.checkMoreText,
      checkMoreHref: data.checkMoreHref
    });
  }

  const activator = (
    <li className="more" onClick={edit}>
      {data.checkMoreText}
    </li>
  );

  const primaryAction = {
    content: "Save",
    loading,
    onAction: () => {
      const menus = cloneDeep(metafields);
      let item = menus.value.children[indexs[0]];
      Object.assign(item, form);
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
              label="checkMoreText"
              value={form.checkMoreText}
              onChange={(value) => updateForm("checkMoreText", value)}
            />
            <TextField
              label="checkMoreHref"
              value={form.checkMoreHref}
              onChange={(value) => updateForm("checkMoreHref", value)}
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
}
