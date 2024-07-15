import { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import api from "../api"; // Adjust API path as necessary
import CoordinateSystem from "./CoordinateSystem";

const CountPathsForm = () => {
  const [routes, setRoutes] = useState<string[]>([]);
  const [count, setCount] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);

  const showMessage = () => {
    setDisplayMessage(true);
    setTimeout(() => {
      setDisplayMessage(false);
    }, 5000);
  };

  const countPaths = async (values: { x: number; y: number }) => {
    setLoading(true);
    try {
      const response = await api.post("/count-paths", values);
      setCount(response.data.length);
      console.log("res", response);
      const data: Record<number, string> = response.data;
      const paths = Object.values(data); // Convert object values to array
      setRoutes(paths);
      setLoading(false);
    } catch (err) {
      setError("Error fetching paths. Please try again.");
      setLoading(false);
      showMessage();
    }
  };

  return (
    <div className="flex flex-col">
      <Formik
        initialValues={{ x: 0, y: 0 }}
        onSubmit={(values) => {
          countPaths(values);
        }}
        validationSchema={Yup.object().shape({
          x: Yup.number()
            .required("Steps East (X) is required")
            .min(0, "Must be a positive number"),
          y: Yup.number()
            .required("Steps North (Y) is required")
            .min(0, "Must be a positive number"),
        })}
      >
        {({ errors, touched, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            className="relative ml-7 flex justify-center items-center m-10 lg:m-20"
          >
            <div className=" w-full lg:w-[55%]">
              <div className="flex justify-center mb-5">
                <h1 className=" ml-3 uppercase text-3xl text-bold text-green-500 font-bold italic">
                  Count Paths
                </h1>
              </div>
              <div className="grid grid-rows-1 ml-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 w-full">
                  <div className="flex flex-col">
                    <label className="mb-1">Steps East (X)</label>
                    <Field
                      name="x"
                      type="number"
                      placeholder="0"
                      className={`w-full h-14 bg-white border ${
                        touched.x && errors.x
                          ? "border-red-500"
                          : "border-gray-300"
                      } pl-3 text-zinc-400 shadow-lg rounded-sm`}
                    />
                    {touched.x && errors.x && (
                      <p className="text-red-500">{errors.x}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1">Steps North (Y)</label>
                    <Field
                      name="y"
                      type="number"
                      placeholder="0"
                      className={`w-full h-14 bg-white border ${
                        touched.y && errors.y
                          ? "border-red-500"
                          : "border-gray-300"
                      } pl-3 text-zinc-400 shadow-lg rounded-sm`}
                    />
                    {touched.y && errors.y && (
                      <p className="text-red-500">{errors.y}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-start flex-col mb-5 mt-8 relative">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-green-500 rounded-md w-full h-12 text-sm text-white ${
                      loading ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    Count Paths
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {displayMessage && error && (
        <p className="ml-14 pl-1 text-red-500">{error}</p>
      )}
      {routes.length !== 0 && (
        <div>
          <div className="grid place-items-center">
            <h2 className="text-lg font-bold">Results</h2>
            <p>Number of valid paths: {count}</p>
          </div>
          {routes.length <= 11971 && <CoordinateSystem routes={routes} />}
        </div>
      )}
    </div>
  );
};

export default CountPathsForm;
