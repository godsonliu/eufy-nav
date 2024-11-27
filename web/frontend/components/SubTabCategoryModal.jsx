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

const SubTabCategoryModal = ({
  subTabCategoryEdit,
  onClose,
  headerSetting,
  onSave,
  subTabCategoryEditIndex,
  subTabEditIndex,
}) => {
  const { control, handleSubmit, reset } = useForm({
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tabTabs",
  });

  useEffect(() => {
    if (!(headerSetting && !!headerSetting.length)) return;
    const headerSettingItem = headerSetting[subTabEditIndex];
    const tab = headerSettingItem?.tabs?.[subTabCategoryEditIndex];
    const { tabs = [] } = tab;
    const tabTabs = [];
    if (tabTabs && Array.isArray(tabTabs)) {
      tabs.forEach((item) => tabTabs.push(item));
    }
    reset({ tabTabs });
  }, [headerSetting, subTabCategoryEditIndex]);

  return (
    <Modal
      title="category"
      large
      open={subTabCategoryEdit}
      onClose={() => onClose && onClose()}
      primaryAction={{
        content: "确定",
        onAction: () => {
          handleSubmit((formData) => {
            const { tabTabs } = formData;
            let _headerSetting = cloneDeep(headerSetting);
            const result = _headerSetting.map((item, index) => {
              if (subTabEditIndex === index) {
                const { tabs = [] } = item;
                return {
                  ...item,
                  tabs: tabs?.map((tab, idx) =>
                    idx === subTabCategoryEditIndex
                      ? { ...tab, tabs: tabTabs }
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
                        validate: (value) =>
                          value.length <= 100 || "Max length is 100 characters", // 自定义校验
                      }}
                      name={`tabTabs.${index}.label`}
                      control={control}
                    />
                    <Controller
                      render={({ field }) => (
                        <TextField label="href" {...field} />
                      )}
                      name={`tabTabs.${index}.more`}
                      control={control}
                    />
                    <div className="flex gap-4 h-full items-end pb-2">
                      <Button plain monochrome onClick={() => remove(index)}>
                        <Icon source={CircleMinusMinor}></Icon>
                      </Button>
                      {fields.length - 1 === index && (
                        <Button plain monochrome onClick={() => append()}>
                          <Icon source={CirclePlusMinor}></Icon>
                        </Button>
                      )}
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

export default SubTabCategoryModal;
