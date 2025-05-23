import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import DeleteConfirmPromptContextProvider from "@/contexts/deleteConfirmPromptContext";
import DeleteConfirmPrompt from "@/components/DeleteConfirmPrompt";
import axiosBase from "@/axios/axios";
import AppBarOutProject from "@/components/AppBars/AppBarOutProject";

export const Route = createFileRoute("/_auth")({
    component: RouteComponent,
    beforeLoad: async () => {
        const responseStatus = await axiosBase("/auth/status")
            .then((response) => {
                localStorage.setItem("userData", JSON.stringify(response.data));
                return response.status;
            })
            .catch((e) => {
                console.log(e);
            });

        if (responseStatus !== 200) {
            throw redirect({ to: "/", replace: true });
        }
    },
});

function RouteComponent() {
    return (
        <DeleteConfirmPromptContextProvider>
            <DeleteConfirmPrompt />
            <AppBarOutProject />
            <Outlet />
        </DeleteConfirmPromptContextProvider>
    );
}
