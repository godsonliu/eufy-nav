import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Icon,
  Button,
  Modal,
  Form,
  FormLayout,
  TextField,
  Spinner,
  Box,
  Select,
  ButtonGroup,
  Grid,
} from "@shopify/polaris";
import { CirclePlusMinor, CircleMinusMinor } from "@shopify/polaris-icons";
import { cloneDeep } from "lodash";

const SubTabLinksModal = ({
  subTabLinksEdit,
  onClose,
  headerSetting,
  onSave,
  subTabEditIndex,
  subTabLinksEditIndex,
}) => {
  const { control, handleSubmit, reset } = useForm({
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tabLinks",
  });

  useEffect(() => {
    if (!(headerSetting && !!headerSetting.length)) return;
    const headerSettingItem = headerSetting[subTabEditIndex];
    const { tabs } = headerSettingItem;
    const tab = tabs?.[subTabLinksEditIndex];
    const { links = [] } = tab;
    const tabLinks = [];
    if (links && Array.isArray(links)) {
      links.forEach((item) => tabLinks.push(item));
    }
    reset({ tabLinks });
  }, [headerSetting, subTabLinksEditIndex]);

  return (
    <Modal
      title={"links"}
      large
      open={subTabLinksEdit}
      onClose={() => onClose && onClose()}
      primaryAction={{
        content: "确定",
        onAction: () => {
          handleSubmit((formData) => {
            const { tabLinks } = formData;
            let _headerSetting = cloneDeep(headerSetting);
            const result = _headerSetting.map((item, index) => {
              if (subTabEditIndex === index) {
                const { tabs = [] } = item;
                return {
                  ...item,
                  tabs: tabs?.map((tab, idx) =>
                    idx === subTabLinksEditIndex
                      ? { ...tab, links: tabLinks }
                      : tab
                  ),
                };
              } else {
                return item;
              }
            });
            onSave && onSave(result);
          })();
        },
      }}
      secondaryActions={{
        content: "取消",
        destructive: true,
        onAction: () => {
          onClose && onClose();
        },
      }}
    >
      <Modal.Section>
        <Form>
          <FormLayout>
            {fields?.length ? (
              fields?.map((field, index) => {
                return (
                  <FormLayout.Group condensed key={field.id}>
                    <Controller
                      render={({ field, fieldState }) => (
                        <TextField
                          required
                          label="title"
                          requiredIndicator
                          error={fieldState.error?.message}
                          {...field}
                        />
                      )}
                      rules={{
                        required: "This field is required",
                      }}
                      name={`tabLinks.${index}.label`}
                      control={control}
                    />
                    <Controller
                      render={({ field }) => (
                        <TextField label="href" {...field} />
                      )}
                      name={`tabLinks.${index}.href`}
                      control={control}
                    />
                    <div className="flex gap-4 h-full items-end pb-2">
                      <Button plain monochrome onClick={() => remove(index)}>
                        <Icon source={CircleMinusMinor}></Icon>
                      </Button>
                      <Button plain monochrome onClick={() => append()}>
                        <Icon source={CirclePlusMinor}></Icon>
                      </Button>
                    </div>
                  </FormLayout.Group>
                );
              })
            ) : (
              <Button
                plain
                monochrome
                icon={CirclePlusMinor}
                onClick={() => append()}
              >
                Add
              </Button>
            )}
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
};

export default SubTabLinksModal;
