import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import DeleteConfirmPromptContextProvider from "@/contexts/deleteConfirmPromptContext";
import DeleteConfirmPrompt from "@/components/DeleteConfirmPrompt";
import axiosBase from "@/axios/axios";
import { AppBar, Toolbar, Box, Typography, Stack, Menu, MenuItem } from "@mui/material";
import TooltipIconButton from "@/components/TooltipIconButton";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AppBarOutProject from "@/components/AppBarOutProject/AppBarOutProject";

export const Route = createFileRoute("/_auth")({
    component: RouteComponent,
    // beforeLoad: async () => {
    //     const responseStatus = await axiosBase("/auth/status")
    //         .then((response) => {
    //             localStorage.setItem("userData", JSON.stringify(response.data));
    //             return response.status;
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         });

    //     if (responseStatus !== 200) {
    //         throw redirect({ to: "/", replace: true });
    //     }
    // },
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
