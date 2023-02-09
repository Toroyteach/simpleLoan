import { Link, useNavigate } from "react-router-dom";
import { createRef, useState } from "react";
import axiosClient from "../../axios-client.js";
import Swal from 'sweetalert2'

export default function Register() {
  const nameRef = createRef()
  const emailRef = createRef()
  const [errors, setErrors] = useState(null)
  const navigate = useNavigate();


  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
    }
    axiosClient.post('/registerNewUser', payload)
      .then(({ data }) => {

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your Details has been saved. Please come back and login after a day to confirm your account status.',
          showConfirmButton: false,
          timer: 5000
        })

      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })

  }

  return (
    <>


      <div className="login-signup-form animated fadeInDown">
        <div className="form">
          <form onSubmit={onSubmit}>
            <h1 className="title">Register</h1>
            {errors &&
              <div className="alert">
                {Object.keys(errors).map(key => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            }
            <input ref={nameRef} type="text" placeholder="Full Name" />
            <input ref={emailRef} type="email" placeholder="Email Address" />
            <button className="btn btn-block">Register</button>
            <p className="message">Already registered? <Link to="/login">Sign In</Link></p>
          </form>
        </div>
      </div>
    </>
  )
}
