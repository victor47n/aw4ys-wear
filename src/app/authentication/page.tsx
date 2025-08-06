import { Header } from "@/_components/common/header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";

import SignInForm from "./_components/sign-in-form";
import SignUpForm from "./_components/sign-up-form";

const AuthenticationPage = async () => {
  return (
    <>
      <Header />
      <div className="flex w-full flex-col items-center justify-center gap-6 p-5">
        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList>
            <TabsTrigger value="sign-in">Entrar</TabsTrigger>
            <TabsTrigger value="sign-up">Criar conta</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="w-full">
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign-up" className="w-full">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AuthenticationPage;
