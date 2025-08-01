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

const MainDealsModal = ({
  mainDealsEdit,
  onClose,
  headerSetting,
  onSave,
  mainDealsEditIndex,
}) => {
  const { control, handleSubmit, reset } = useForm({
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "megaDeals",
  });

  useEffect(() => {
    if (!(headerSetting && !!headerSetting.length)) return;
    const headerSettingItem = headerSetting?.[mainDealsEditIndex];
    const { links } = headerSettingItem || {};
    const megaDeals = [];
    if (links && Array.isArray(links)) {
      links.forEach((link) => megaDeals.push(link));
    }
    reset({ megaDeals });
  }, [headerSetting, mainDealsEditIndex]);

  const themeTypeOptions = [
    { label: "black", value: "black" },
    { label: "light", value: "light" },
  ];

  return (
    <Modal
      title="deals"
      large
      open={mainDealsEdit}
      onClose={() => onClose && onClose()}
      primaryAction={{
        content: "确定",
        onAction: () => {
          handleSubmit((formData) => {
            const { megaDeals } = formData;
            let _headerSetting = cloneDeep(headerSetting);
            const result = _headerSetting.map((item, index) => {
              if (mainDealsEditIndex === index) {
                return {
                  ...item,
                  links: megaDeals,
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
            {fields?.map((field, index) => {
              return (
                <FormLayout.Group condensed key={field.id}>
                  <Controller
                    render={({ field, fieldState }) => (
                      <Select
                        required
                        label="theme"
                        requiredIndicator
                        name="theme"
                        options={themeTypeOptions}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    )}
                    name={`megaDeals.${index}.theme`}
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
                    name={`megaDeals.${index}.title`}
                    control={control}
                  />
                  <Controller
                    render={({ field }) => (
                      <TextField label="href" {...field} />
                    )}
                    name={`megaDeals.${index}.href`}
                    control={control}
                  />
                  <Controller
                    render={({ field }) => <TextField label="img" {...field} />}
                    name={`megaDeals.${index}.img`}
                    control={control}
                  />
                  <Controller
                    render={({ field }) => <TextField label="btn" {...field} />}
                    name={`megaDeals.${index}.btn`}
                    control={control}
                  />
                  <div className="flex gap-4 h-full items-end pb-2">
                    <Button plain monochrome onClick={() => remove(index)}>
                      <Icon source={CircleMinusMinor}></Icon>
                    </Button>
                    <Button plain monochrome onClick={() => append({})}>
                      <Icon source={CirclePlusMinor}></Icon>
                    </Button>
                  </div>
                </FormLayout.Group>
              );
            })}
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
};

export default MainDealsModal;
