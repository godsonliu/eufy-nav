import {
  Form,
  FormLayout,
  TextField,
  Modal,
  Button,
  Select,
} from "@shopify/polaris";
import { CirclePlusMinor } from "@shopify/polaris-icons";
import { useState } from "react";
import { cloneDeep } from "lodash";

export function MoreTab({ metafields, updateMenus }) {
  const [active, setActive] = useState(false);
  const [loading, setLoaing] = useState(false);
  const [form, setForm] = useState({});
  const [index, setIndex] = useState("");

  const updateForm = (key, value) => {
    const newForm = cloneDeep(form);
    newForm[key] = value;
    setForm(newForm);
  };

  const add = () => {
    setActive(true);
    setForm({ type: "tab" });
    setIndex("");
  };

  const activator = (
    <div className="data-tab-item">
      <Button plain monochrome icon={CirclePlusMinor} onClick={add}>
        Add
      </Button>
    </div>
  );

  const primaryAction = {
    content: "Save",
    loading,
    onAction: () => {
      const menus = cloneDeep(metafields);
      let item = menus.value.children;
      const newForm = {
        id: form.name,
        parentId: menus.key,
        children: [],
        ...form,
      };
      if (index) {
        item.splice(index - 1, 0, newForm);
      } else {
        item.push(newForm);
      }
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
      title="Add"
      open={active}
      onClose={() => setActive(false)}
      primaryAction={primaryAction}
    >
      <Modal.Section>
        <Form>
          <FormLayout>
            <TextField
              label="name"
              value={form.name}
              onChange={(value) => updateForm("name", value)}
            />
            <Select
              label="type"
              options={[
                { label: "tab", value: "tab" },
                { label: "image", value: "image" },
                { label: "poster", value: "poster" },
                { label: "link", value: "link" },
              ]}
              value={form.type}
              onChange={(value) => updateForm("type", value)}
            />
            {form.type === "link" && (
              <TextField
                label="href"
                value={form.href}
                onChange={(value) => updateForm("href", value)}
              />
            )}
            <TextField
              label="index"
              value={index}
              onChange={(value) => setIndex(value)}
              helpText="add to index item.(optional, default add to last)"
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
}
