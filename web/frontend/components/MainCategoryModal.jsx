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

const MainCategoryModal = ({
  mainCategoryEdit,
  onClose,
  headerSetting,
  onSave,
}) => {
  const [typeChanged, setTypeChanged] = useState(false);
  const [typeChangedIndex, setTypeChangedIndex] = useState(0);
  const { control, handleSubmit, reset } = useForm({
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "headerSettingData",
  });

  useEffect(() => {
    reset({ headerSettingData: headerSetting });
  }, [headerSetting]);

  const mainCategoryTypeOptions = [
    { label: "tab", value: "tab" },
    { label: "deals", value: "deals" },
    { label: "links", value: "links" },
    { label: "support", value: "support" },
    { label: "live", value: "live" },
    { label: "无", value: "none" },
  ];

  return (
    <Modal
      title="一级分类"
      large
      open={mainCategoryEdit}
      onClose={() => onClose && onClose()}
      primaryAction={{
        content: "确定",
        onAction: () => {
          handleSubmit((formData) => {
            onSave && onSave(formData?.headerSettingData);
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
            {fields?.map((field, index) => {
              return (
                <FormLayout.Group condensed key={field.id}>
                  <Controller
                    render={({ field, fieldState }) => (
                      <Select
                        required
                        label="Type"
                        requiredIndicator
                        name="type"
                        options={mainCategoryTypeOptions}
                        error={fieldState.error?.message}
                        {...field}
                        onChange={(val) => {
                          field?.onChange(val);
                          setTypeChanged(true);
                          setTypeChangedIndex(index);
                        }}
                      />
                    )}
                    rules={{
                      required: "This field is required",
                    }}
                    name={`headerSettingData.${index}.type`}
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
                    }}
                    name={`headerSettingData.${index}.label`}
                    control={control}
                  />
                  <Controller
                    render={({ field }) => (
                      <TextField label="href" {...field} />
                    )}
                    name={`headerSettingData.${index}.href`}
                    control={control}
                  />
                  <Controller
                    render={({ field }) => <TextField label="tag" {...field} />}
                    name={`headerSettingData.${index}.tag`}
                    control={control}
                  />
                  <div className="flex gap-4 h-full items-end pb-2">
                    <Button plain monochrome onClick={() => remove(index)}>
                      <Icon source={CircleMinusMinor}></Icon>
                    </Button>
                    <Button
                      plain
                      monochrome
                      onClick={() => append({ type: "tab" })}
                    >
                      <Icon source={CirclePlusMinor}></Icon>
                    </Button>
                  </div>
                </FormLayout.Group>
              );
            })}
          </FormLayout>
        </Form>
      </Modal.Section>
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
    </Modal>
  );
};

export default MainCategoryModal;
