"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/_components/ui/button";
import { LogInIcon } from "lucide-react";

export default function LoginButton() {
  return (
    <SignInButton>
      {/* Remova qualquer lógica complexa de dentro do botão aqui */}
      <Button variant="outline">
        <LogInIcon className="mr-2" />
        Fazer login ou criar conta
      </Button>
    </SignInButton>
  );
}
