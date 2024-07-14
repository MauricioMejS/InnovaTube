import { useForm } from "react-hook-form";
import swal from 'sweetalert';

export default function Registro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    if (data.password !== data.confirmPassword || data.password === "") {
      swal({
        title: "Las contraseñas no coinciden",
        text: "Por favor, verifica que las contraseñas sean iguales",
        icon: "warning",
        button: true,
      })
      return;
    }
    fetch("/api/auth/singup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          console.log("Usuario registrado");
          swal({
            title: "Usuario registrado",
            icon: "success",
            button: true,
          })
        } else {
          console.error("Error al registrar usuario");
          swal({
            title: "Error al registrar usuario",
            text: "Por favor, intenta nuevamente",
            icon: "error",
            button: true,
          })
        }
      })
      .catch((error) => {
        console.error("Error al registrar usuario", error);
        swal({
          title: "Error al registrar usuario",
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
        <div className="flex flex-row">
          <div className="flex flex-col w-[50%] mr-1">
            <label className="text-white">Nombre: </label>
            <input
              className="px-3 py-2 rounded"
              placeholder="Nombre"
              type="text"
              {...register("name", {
                required: {
                  value: true,
                  message: "Este campo es requerido",
                },
              })}
            />
            {errors.name && (
              <label className="text-red-600">{errors.name.message}</label>
            )}
          </div>
          <div className="flex flex-col w-[50%] ml-1">
            <label className="text-white">Apellido: </label>
            <input
              className="px-3 py-2 rounded"
              placeholder="Apellido"
              type="text"
              {...register("surename", {
                required: {
                  value: true,
                  message: "Este campo es requerido",
                },
              })}
            />
            {errors.surename && (
              <label className="text-red-600">{errors.surename.message}</label>
            )}
          </div>
        </div>
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
        <label className="text-white">Confirmar Contraseña</label>
        <input
          className="px-3 py-2 rounded"
          placeholder="••••••••••"
          type="confirmPassword"
          {...register("confirmPassword", {
            required: {
              value: true,
              message: "Este campo es requerido",
            },
          })}
        />
        {errors.confirmPassword && (
          <label className="text-red-600">
            {errors.confirmPassword.message}
          </label>
        )}

        <div className="flex justify-center">
          <button className="bg-white rounded mt-6 w-[300px] h-[40px]">
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
}
