import { Form, FormLayout, TextField, Modal, Button, Checkbox } from "@shopify/polaris";
import { CirclePlusMinor } from "@shopify/polaris-icons";
import { useState } from "react";
import { cloneDeep } from "lodash";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";

export function Poster({ metafields, updateMenus, indexs }) {
  const data = metafields.value.children[indexs[0]].children;

  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const [active, setActive] = useState(false);
  const [loadingAdd, setLoaingAdd] = useState(false);
  const [loadingDel, setLoaingDel] = useState(false);
  const [title, setTitle] = useState("");
  const [form, setForm] = useState({});

  const updateForm = (key, value) => {
    const newForm = cloneDeep(form);
    newForm[key] = value;
    setForm(newForm);
  };

  const edit = (i) => {
    setTitle("Edit");
    setActive(true);
    const item = data[i];
    setForm({ ...item });
  };

  const add = () => {
    setTitle("Add");
    setActive(true);
    setForm({});
  };

  const primaryAction = {
    content: "Save",
    loading: loadingAdd,
    onAction: () => {
      const menus = cloneDeep(metafields);
      const parent = menus.value.children[indexs[0]];
      const item = parent.children;
      if (title === "Add") {
        const newForm = {
          id: "poster_1",
          name: "poster_1",
          parentId: parent.id,
          ...form
        };
        item.push(newForm);
      } else {
        Object.assign(item[0], form);
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
      const parent = menus.value.children[indexs[0]];
      const item = parent.children;
      item.splice(0, 1);
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
        path: '/settings/files',
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
              <li className="poster-box" key={i} onClick={() => edit(i)}>
                <img src={item.imageUrl} />
                {!item.image_txt_isLeave && (
                  <div className="text">
                    <p
                      className="poster-img-title"
                      dangerouslySetInnerHTML={{ __html: item.posterTitle }}
                      style={{ color: item.posterTitleColor }}
                    ></p>
                    <p
                      className="poster-img-desc"
                      dangerouslySetInnerHTML={{ __html: item.posterDesc }}
                      style={{ color: item.posterDescColor }}
                    ></p>
                    <p
                      className="poster-img-button"
                      style={{
                        color: item.posterButtonColor,
                        backgroundColor: item.posterButtonBgColor,
                        borderColor: item.posterButtonBorderColor,
                      }}
                    >
                      {item.posterButtonText}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        {data.length < 1 && (
          <li className="item-add">
            <Button plain monochrome icon={CirclePlusMinor} onClick={add}>
              Add
            </Button>
          </li>
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
                label="imageUrl"
                labelAction={labelAction}
                value={form.imageUrl}
                onChange={(value) => updateForm("imageUrl", value)}
              />
              <TextField
                label="mobileImageUrl"
                value={form.mobileImageUrl}
                onChange={(value) => updateForm("mobileImageUrl", value)}
              />
              <TextField
                label="href"
                value={form.href}
                onChange={(value) => updateForm("href", value)}
              />
              <Checkbox
                label="image_txt_isLeave"
                checked={form.image_txt_isLeave}
                onChange={(value) => updateForm("image_txt_isLeave", value)}
                helpText="don't show text when checked"
              />
              <TextField
                label="posterTitle"
                value={form.posterTitle}
                onChange={(value) => updateForm("posterTitle", value)}
              />
              <TextField
                label="posterTitleColor"
                value={form.posterTitleColor}
                onChange={(value) => updateForm("posterTitleColor", value)}
              />
              <TextField
                label="posterDesc"
                value={form.posterDesc}
                onChange={(value) => updateForm("posterDesc", value)}
              />
              <TextField
                label="posterDescColor"
                value={form.posterDescColor}
                onChange={(value) => updateForm("posterDescColor", value)}
              />
              <TextField
                label="posterButtonText"
                value={form.posterButtonText}
                onChange={(value) => updateForm("posterButtonText", value)}
              />
              <TextField
                label="posterButtonColor"
                value={form.posterButtonColor}
                onChange={(value) => updateForm("posterButtonColor", value)}
              />
              <TextField
                label="posterButtonBgColor"
                value={form.posterButtonBgColor}
                onChange={(value) => updateForm("posterButtonBgColor", value)}
              />
              <TextField
                label="posterButtonBorderColor"
                value={form.posterButtonBorderColor}
                onChange={(value) => updateForm("posterButtonBorderColor", value)}
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </>
  );
}
