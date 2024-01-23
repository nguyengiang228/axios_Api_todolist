import React, { useEffect, useState } from "react";
import {
  IUser,
  IUserData,
  IUserEditForm,
  IUserParam,
} from "../../interfaces/user";
import { customApi } from "../../request/reques";

const User = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [editForm, setEditForm] = useState<IUserEditForm>({
    id: 0,
    isEdit: false,
  });
  const [inputvalue, setInputValue] = useState<IUserData>({
    name: "",
    email: "",
  });
  const [checkEmail, setCheckEmail] = useState("");
  const [checkErrorName, setCheckErrorName] = useState("");

  const param = {};
  const regx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const handleCreateUser = () => {
    const createUser = async () => {
      try {
        const { data, status } = await customApi.post<IUser, IUserData>(
          "/users/",
          inputvalue
        );

        //check reset input

        if (status < 200 || status >= 300) {
          console.log("Có lỗi xảy ra: ", status);
        } else {
          setInputValue({ name: "", email: "" });
        }

        if (data.name.trim() === "" && data.email.trim() === "") {
          setCheckErrorName("Vui lòng nhập Name");
          setCheckEmail("Vui lòng nhập lại Email!");
        } else if (!regx.test(data.email)) {
          setCheckEmail("Vui lòng nhập lại Email!");
        } else {
          setUsers([...users, data]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    createUser();
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === "") {
      setCheckErrorName("Vui lòng nhập trường này");
      console.log("Vui long nhap Name");
    }

    setInputValue({ ...inputvalue, name: e.target.value });
  };
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (regx.test(e.target.value)) {
      setCheckEmail("");
    } else {
      setCheckEmail("Vui lòng nhập lại Email!");
    }
    setInputValue({ ...inputvalue, email: e.target.value });
  };

  const handleDelete = (id: number) => {
    const deleteUser = async () => {
      try {
        await customApi.delete<IUser>(`/users/${id}`);
        const deleteId = users.filter((user) => user.id !== id);
        const conf = window.confirm(
          "Are you sure you want to delete this user"
        );
        if (conf) {
          setUsers(deleteId);
        }
      } catch (err) {
        console.log(err);
      }
    };
    deleteUser();
  };

  const handleEditUser = () => {
    const editUser = async () => {
      try {
        await customApi.put<IUser[], IUserData>(`/users/${editForm.id}`, {
          name: inputvalue.name,
          email: inputvalue.email,
        });
        const editUser = users.map((user) => {
          if (user.id === editForm.id) {
            return {
              id: user.id,
              name: inputvalue.name,
              email: inputvalue.email,
            };
          }
          return user;
        });
        setUsers(editUser);
        setEditForm({ id: 0, isEdit: false });
        setInputValue({ name: "", email: "" });
      } catch (err) {
        console.log(err);
      }
    };
    editUser();
  };

  const handleCancel = () => {
    setEditForm({
      id: 0,
      isEdit: false,
    });
    setInputValue({ name: "", email: "" });
    setCheckEmail("");
  };

  const handleCheckIsEditForm = (id: number) => {
    setEditForm({
      id,
      isEdit: true,
    });
    const finUser = users.find((user) => user.id === id);
    if (finUser) {
      const newUser = {
        name: finUser.name,
        email: finUser.email,
      };
      setInputValue(newUser);
    }
    setCheckEmail("");
  };

  useEffect(() => {
    const exportOrderManagementFile = async () => {
      try {
        const { data } = await customApi.get<IUser[], IUserParam>(
          "/users/",
          param
        );
        setUsers(data);
      } catch (err) {
        console.log(err);
      }
    };
    exportOrderManagementFile();
  }, []);
  return (
    <>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={inputvalue.name}
          onChange={handleChangeName}
        />
        <p style={{ color: "orange", fontSize: 13 }}>{checkErrorName}</p>
      </div>
      <div>
        <label>Email: </label>
        <input
          type="email"
          value={inputvalue.email}
          onChange={handleChangeEmail}
        />
        <p style={{ color: "orange", fontSize: 13 }}>{checkEmail}</p>
      </div>

      {!editForm.isEdit ? (
        <>
          <button onClick={handleCreateUser}>Create</button>

          {users.map((user, index) => (
            <div key={index}>
              <tr>
                <td>{user.id}</td>
                &emsp;
                <td>{user.name}</td>
                &emsp;
                <td>{user.email}</td>
                &emsp;
                <button onClick={() => handleDelete(user.id)}>DELETE</button>
                <button onClick={() => handleCheckIsEditForm(user.id)}>
                  EDIT
                </button>
              </tr>
            </div>
          ))}
        </>
      ) : (
        <>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleEditUser}>Save</button>
        </>
      )}
    </>
  );
};

export default User;
