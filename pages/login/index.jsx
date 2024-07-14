import { useForm } from "react-hook-form";
import swal from 'sweetalert';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    fetch("/api/auth/singin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          console.log("Usuario Logueado");
          swal({
            title: "El usuario accedió correctamente",
            icon: "success",
            button: true,
          })
        } else {
          console.error("Error al loguear usuario");
          swal({
            title: "Error al loguear usuario",
            text: "Por favor, intenta nuevamente",
            icon: "error",
            button: true,
          })
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("clientId", data.user.id);
      })
      .catch((error) => {
        console.error("Error al loguear usuario", error);
        swal({
          title: "Error al loguear usuario",
          text: { error },
          icon: "error",
          button: true,
        })
      });
  });
  return (
    <div className="flex flex-row justify-center h-[100vh]">
      <form
        className="flex flex-col w-[600px] justify-center"
        action=""
        onSubmit={onSubmit}
      >
        <label className="text-center mb-9 text-2xl text-white">Registro</label>
        <label className="text-white">Correo Electrónico</label>
        <input
          className="px-3 py-2 rounded"
          placeholder="ejemplo@innovatube.com"
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "Este campo es requerido",
            },
          })}
        />
        {errors.email && (
          <label className="text-red-600">{errors.email.message}</label>
        )}
        <label className="text-white">Contraseña</label>
        <input
          className="px-3 py-2 rounded"
          placeholder="••••••••••"
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "Este campo es requerido",
            },
          })}
        />
        {errors.password && (
          <label className="text-red-600">{errors.password.message}</label>
        )}

        <div className="flex justify-center">
          <button className="bg-white rounded mt-6 w-[300px] h-[40px]">
            Ingresar
          </button>
        </div>
      </form>
    </div>
  );
}
