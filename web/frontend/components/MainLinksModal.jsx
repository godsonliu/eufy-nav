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

const MainLinksModal = ({
  mainLinksEdit,
  onClose,
  headerSetting,
  onSave,
  mainLinksEditIndex,
  mode,
}) => {
  const { control, handleSubmit, reset } = useForm({
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "megaGroup",
  });

  useEffect(() => {
    if (!(headerSetting && !!headerSetting.length)) return;
    const headerSettingItem = headerSetting[mainLinksEditIndex];
    const { group } = headerSettingItem || {};

    const megaGroup = [];
    if (group && Array.isArray(group)) {
      group.forEach((item) =>
        item?.links?.forEach((i) => {
          megaGroup.push({
            category: item?.label,
            ...i,
          });
        })
      );
    }
    reset({ megaGroup });
  }, [headerSetting, mainLinksEditIndex]);

  const modeTypeOptions = [
    { label: "large", value: "large" },
    { label: "small", value: "small" },
  ];

  return (
    <Modal
      title={mode === "small" ? "support" : "links"}
      large
      open={mainLinksEdit}
      onClose={() => onClose && onClose()}
      primaryAction={{
        content: "确定",
        onAction: () => {
          handleSubmit((formData) => {
            const { megaGroup } = formData;

            console.log(megaGroup, "-");
            const group = Object.entries(
              megaGroup?.reduce((acc, item) => {
                const category = item?.category ?? "support";
                if (!acc[category]) acc[category] = [];
                acc[category].push({
                  label: item?.label,
                  href: item?.href,
                });
                return acc;
              }, {})
            ).map(([category, links]) => ({
              label: mode === "small" ? "" : category,
              links,
            }));
            let _headerSetting = cloneDeep(headerSetting);
            const result = _headerSetting.map((item, index) =>
              index === mainLinksEditIndex ? { ...item, group } : item
            );
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
                    {mode !== "small" && (
                      <Controller
                        render={({ field, fieldState }) => (
                          <TextField
                            required
                            label="category"
                            requiredIndicator
                            error={fieldState.error?.message}
                            {...field}
                          />
                        )}
                        rules={{
                          required: "This field is required",
                        }}
                        name={`megaGroup.${index}.category`}
                        control={control}
                      />
                    )}
                    {/* <Controller
                      render={({ field, fieldState }) => (
                        <Select
                          required
                          label="mode"
                          requiredIndicator
                          name="mode"
                          options={modeTypeOptions}
                          error={fieldState.error?.message}
                          {...field}
                        />
                      )}
                      name={`megaGroup.${index}.mode`}
                      control={control}
                    /> */}
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
                      name={`megaGroup.${index}.label`}
                      control={control}
                    />
                    <Controller
                      render={({ field }) => (
                        <TextField label="tag" {...field} />
                      )}
                      name={`megaGroup.${index}.tag`}
                      control={control}
                    />
                    <Controller
                      render={({ field }) => (
                        <TextField label="href" {...field} />
                      )}
                      name={`megaGroup.${index}.href`}
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
                Add Links
              </Button>
            )}
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
};

export default MainLinksModal;
