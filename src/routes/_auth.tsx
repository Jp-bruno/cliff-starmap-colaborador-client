import { createFileRoute, Outlet } from "@tanstack/react-router";
import DeleteConfirmPromptContextProvider from "@/contexts/deleteConfirmPromptContext";
import DeleteConfirmPrompt from "@/components/DeleteConfirmPrompt";

export const Route = createFileRoute("/_auth")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <DeleteConfirmPromptContextProvider>
            <DeleteConfirmPrompt />
            <Outlet />
        </DeleteConfirmPromptContextProvider>
    );
}
