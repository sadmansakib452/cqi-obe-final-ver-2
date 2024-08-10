"use client";


import { changeUserRoleAction } from "@/actions/admin/change-user-role-action";
import { useTransition } from "react";

const ChangeUserRoleInput = ({ email, currentRole, isAdmin }) => {
  const [isPending, startTransition] = useTransition();

  const changeHandler = (email, evt) => {
    const newRole = evt.target.value

    if(newRole === currentRole) return 

    startTransition(async ()=>{
        await changeUserRoleAction(email, newRole)
    })

  }
  return (
    <select
      disabled={isAdmin || isPending}
      defaultValue={currentRole}
      onChange={changeHandler.bind(null, email)}
      className="w-full rounded border border-gray-200 bg-white px-2 py-1 leading-tight focus:border-gray-500 focus:outline-none disabled:opacity-50"
    >

    <option value="user">USER</option>
    <option value ="admin">ADMIN</option>

    </select>
  );
};

export default ChangeUserRoleInput;
