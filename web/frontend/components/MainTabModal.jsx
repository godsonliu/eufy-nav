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

const MainTabModal = ({
  mainTabEdit,
  onClose,
  headerSetting,
  onSave,
  mainTabEditIndex,
}) => {
  const [typeChanged, setTypeChanged] = useState(false);
  const [typeChangedIndex, setTypeChangedIndex] = useState(0);
  const [typeChangedValue, setTypeChangedValue] = useState(false);
  const { control, handleSubmit, reset, watch } = useForm({
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "megaTabs",
  });

  useEffect(() => {
    if (!(headerSetting && !!headerSetting.length)) return;
    const headerSettingItem = headerSetting[mainTabEditIndex];
    const { links, tabs } = headerSettingItem || {};
    const megaTabs = [];
    if (tabs && Array.isArray(tabs)) {
      tabs.forEach((tab) => megaTabs.push({ type: "tabs", ...tab }));
    }
    if (links && Array.isArray(links)) {
      links.forEach((link) => megaTabs.push({ type: "link", ...link }));
    }
    reset({ megaTabs });
  }, [headerSetting, mainTabEditIndex]);

  const mainTabTypeOptions = [
    { label: "tabs", value: "tabs" },
    { label: "link", value: "link" },
  ];

  return (
    <Modal
      title="左侧类目"
      large
      open={mainTabEdit}
      onClose={() => onClose && onClose()}
      primaryAction={{
        content: "确定",
        onAction: () => {
          handleSubmit((formData) => {
            console.log(formData, "formData111");
            const { megaTabs } = formData;
            const tabs = megaTabs.filter((tab) => tab?.type === "tabs");
            const links = megaTabs.filter((tab) => tab?.type === "link");
            let _headerSetting = cloneDeep(headerSetting);
            const result = _headerSetting.map((item, index) => {
              if (mainTabEditIndex === index) {
                return {
                  ...item,
                  tabs,
                  links,
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
                        <Select
                          required
                          label="Type"
                          requiredIndicator
                          name="type"
                          options={mainTabTypeOptions}
                          error={fieldState.error?.message}
                          {...field}
                          onChange={(val) => {
                            if (fields?.[index]?.label) {
                              setTypeChanged(true);
                            } else {
                              setTypeChangedIndex(index);
                              field?.onChange(val);
                            }
                          }}
                        />
                      )}
                      name={`megaTabs.${index}.type`}
                      control={control}
                    />
                    <Controller
                      render={({ field, fieldState }) => (
                        <TextField
                          required
                          label="Title"
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
                      name={`megaTabs.${index}.label`}
                      control={control}
                    />
                    <Controller
                      render={({ field }) => (
                        <TextField label="href" {...field} />
                      )}
                      name={`megaTabs.${index}.href`}
                      control={control}
                    />
                    <div className="flex gap-4 h-full items-end pb-2">
                      <Button plain monochrome onClick={() => remove(index)}>
                        <Icon source={CircleMinusMinor}></Icon>
                      </Button>
                      {fields.length - 1 === index && (
                        <Button
                          plain
                          monochrome
                          onClick={() => append({ type: "tabs" })}
                        >
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
                onClick={() => append({ type: "tabs" })}
              >
                Add
              </Button>
            )}
          </FormLayout>
        </Form>

        {typeChanged && (
          <Modal
            open={typeChanged}
            onClose={() => setTypeChanged(false)}
            title="提醒"
            primaryAction={{
              content: "确定",
              onAction: () => {
                remove(typeChangedIndex);
                setTypeChanged(false);
              },
            }}
            secondaryActions={{
              content: "取消",
              destructive: true,
              onAction: () => {
                setTypeChanged(false);
              },
            }}
          >
            <Modal.Section>
              <p>切换分类会清除此列数据</p>
            </Modal.Section>
          </Modal>
        )}
      </Modal.Section>
    </Modal>
  );
};

export default MainTabModal;
