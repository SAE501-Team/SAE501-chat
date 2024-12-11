import { useState } from "react";
import PropTypes from "prop-types";
import "./Form.css";

const Form = (props) => {
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(JSON.stringify(data, null, 2));

    // * Assuming you have a prop called onSubmit to send data to the parent component
    // eslint-disable-next-line react/prop-types
    props.onSubmit(data);
  };

  return (
    <div className="form-w">
      <h2>Problème rencontré:</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-groupchief">
          <div className="form-group">
            {/* <label htmlFor="category">Problème rencontré:</label> */}
            <select
              id="category"
              name="category"
              required
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Sélectionnez une option</option>
              <option value="product">Un produit est défectueux</option>
              <option value="bug">Un bug sur le site</option>
              <option value="feature">Suggestion d&apos;améliorations</option>
              <option value="other">Autre...</option>
            </select>
            {category === "product" && (
              <div className="form-mgroup">
                <div className="form-group">
                  <label htmlFor="product">
                    Nom du produit:
                    <i className="form-i">*</i>
                  </label>
                  <select id="product" name="product" required>
                    <option value="">Sélectionnez un produit</option>
                    <option value="product1">Produit 1</option>
                    <option value="product2">Produit 2</option>
                    <option value="product3">Produit 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="product">
                    Décrivez le problème:
                    <i className="form-i">*</i>
                  </label>
                  <textarea
                    id="productDetails"
                    name="productDetails"
                    style={{ height: "100px" }}
                    required
                  ></textarea>
                </div>
              </div>
            )}

            {category === "bug" && (
              <div className="form-mgroup">
                <div className="form-group">
                  <label htmlFor="product">
                    Décrivez nous le bug:
                    <i className="form-i">*</i>
                  </label>
                  <textarea
                    id="bugDetails"
                    name="bugDetails"
                    style={{ height: "100px" }}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="product">Images:</label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                  />
                </div>
              </div>
            )}

            {category === "feature" && (
              <div className="form-group">
                <label htmlFor="product">
                  Que peut-on améliorer ?<i className="form-i">*</i>
                </label>
                <textarea
                  id="featureDetails"
                  name="featureDetails"
                  style={{ height: "100px" }}
                  required
                ></textarea>
              </div>
            )}

            {category === "other" && (
              <div className="form-group">
                <label htmlFor="details">
                  Expliquez votre problème:
                  <i className="form-i">*</i>
                </label>
                <textarea
                  id="details"
                  name="details"
                  style={{ height: "100px" }}
                  required
                ></textarea>
              </div>
            )}
          </div>
        </div>

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Form;
