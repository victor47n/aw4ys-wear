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
    <div className="flex w-full flex-col items-center justify-center gap-6 sm:h-screen">
      <Tabs defaultValue="sign-in">
        <TabsList>
          <TabsTrigger value="sign-in">Entrar</TabsTrigger>
          <TabsTrigger value="sign-up">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <SignInForm />
        </TabsContent>
        <TabsContent value="sign-up">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
