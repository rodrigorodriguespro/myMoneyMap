import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AccountForm = ({ onSubmit, type }) => {
  const [formData, setFormData] = useState({
    userId: "",
    workspaceId: "",
    icon: "",
    name: "",
    ...(type === "account" ? { initialBalance: "", initialBalanceDate: "" } : { closing: "", maturity: "", totalLimit: "" }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="userId">User ID</Label>
        <Input name="userId" value={formData.userId} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="workspaceId">Workspace ID</Label>
        <Input name="workspaceId" value={formData.workspaceId} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="icon">Icon</Label>
        <Input name="icon" value={formData.icon} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input name="name" value={formData.name} onChange={handleChange} required />
      </div>
      {type === "account" ? (
        <>
          <div>
            <Label htmlFor="initialBalance">Initial Balance</Label>
            <Input name="initialBalance" value={formData.initialBalance} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="initialBalanceDate">Initial Balance Date</Label>
            <Input name="initialBalanceDate" type="date" value={formData.initialBalanceDate} onChange={handleChange} required />
          </div>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="closing">Closing</Label>
            <Input name="closing" value={formData.closing} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="maturity">Maturity</Label>
            <Input name="maturity" value={formData.maturity} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="totalLimit">Total Limit</Label>
            <Input name="totalLimit" value={formData.totalLimit} onChange={handleChange} required />
          </div>
        </>
      )}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default AccountForm;