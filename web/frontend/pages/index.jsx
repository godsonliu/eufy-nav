import {
  Page,
  Layout,
} from "@shopify/polaris";
import { Menus } from "../components";

export default function HomePage() {

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Menus />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
