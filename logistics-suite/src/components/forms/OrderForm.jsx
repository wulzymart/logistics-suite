import React from "react";
import { appBrain } from "../../AppBrain";
import Select from "../select-input/select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Input from "../input/input";
import CustomButton from "../button/button.jsx";
import Textarea from "../textarea/textarea.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  setIntraCity,
  setIntraState,
  setDeliveryType,
  setDeliveryService,
  setOriginStation,
  setDestinationStation,
  setOriginStationId,
  setDestinationStationId,
  setReceiverFirstName,
  setReceiverLastName,
  setReceiverBusinessName,
  setReceiverPhone,
  setReceiverState,
  setReceiverLga,
  setReceiverStreetAddress,
  setItemShipment,
  setItemDescription,
  setItemValue,
  setItemWeight,
  setItemQuantity,
  setItemCondition,
  setFreightPrice,
  setSubtotal,
  setVAT,
  setAdditionalCharges,
  setTotalAdditionalCharges,
  setInsurance,
  setTotal,
  setCustomerDetails,
  setProcessedBy,
  setOrderId,
} from "../../redux/order.slice";
import { useAppConfigContext } from "../../contexts/AppConfig.context";
import { useUserContext } from "../../contexts/CurrentUser.Context";

const OrderForm = () => {
  const { currentUser } = useUserContext();
  console.log(currentUser);
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);
  const order = useSelector((state) => state.order);
  const {
    states,
    statesList,
    stations,

    stationsList,
  } = useAppConfigContext();
  console.log(states);
  const shipmentCartegoryOptions = Object.keys(appBrain.shipmentCartegory).map(
    (key) => key
  );
  return (
    <div>
      <p className="font-bold text-2xl text-center  mb-20">
        WAYBILL INFORMATION
      </p>
      {/* Order type info */}
      <div id="order-details" className="mb-20">
        <h1 className="  font-bold text-xl text-center ">Delivery details</h1>
        <hr className="w-40 mx-auto mt-3 mb-10" />
        <div>
          <p className="text-red-800 font-light text-xs mb-3">
            Enter the delivery information; (
            <i>Delivery type, Service type, Destination hub</i>)
          </p>
          <div className=" flex flex-col   gap-8">
            <div className="w-full flex flex-col md:flex-row gap-8">
              <div className="w-full flex flex-col items-center">
                <p className=" mb-5">Same State Delivery?</p>
                <Select
                  name={"intraState"}
                  value={order.intraState}
                  options={appBrain.interCityOptions}
                  handleChange={(e) => {
                    dispatch(setIntraState(e.target.value));
                  }}
                  children={"Select one"}
                />
              </div>
              {order.intraState === "Yes" && (
                <div className="w-full flex flex-col items-center">
                  <p className=" mb-5">Same City Delivery?</p>
                  <Select
                    name={"intraCity"}
                    value={order.intraCity}
                    options={appBrain.interCityOptions}
                    handleChange={(e) => {
                      dispatch(setIntraCity(e.target.value));
                    }}
                    children={"Select one"}
                  />
                </div>
              )}
              {order.intraCity === "No" && (
                <div className="w-full flex flex-col items-center">
                  <p className=" mb-5">Delivery type</p>
                  <Select
                    name={"deliveryType"}
                    value={order.deliverType}
                    options={appBrain.deliveryTypeOptions}
                    handleChange={(e) =>
                      dispatch(setDeliveryType(e.target.value))
                    }
                    children={"Type of Delivery"}
                  />
                </div>
              )}
              {order.intraCity === "No" && (
                <div className="w-full flex flex-col items-center">
                  <p className="mb-5 text-center">Delivery Service</p>
                  <Select
                    name={"serviceType"}
                    value={order.deliverService}
                    options={appBrain.serviceTypeOptions}
                    handleChange={(e) =>
                      dispatch(setDeliveryService(e.target.value))
                    }
                    children={"Delivery Service"}
                  />
                </div>
              )}
              <div className="w-full flex flex-col items-center">
                <p className=" mb-5 text-center">Origin Station</p>
                <Select
                  name={"originStation"}
                  value={order.originStation}
                  options={stationsList}
                  handleChange={(e) => {
                    dispatch(setOriginStation(e.target.value));
                    dispatch(setOriginStationId(stations[e.target.value].id));
                  }}
                  children={"Origin Station"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="receiver" className="mb-20">
        <h1 className=" font-bold text-xl text-center ">
          Receivers Information
        </h1>
        <hr className="w-40 mx-auto mt-3 mb-10" />

        <div>
          <p className="text-red-800 font-light text-xs mb-3">
            Enter Receiver's information; (
            <i>
              Phone: +2348012345678, First name and Last name or Business name
              (enter address when necessary)
            </i>
            )
          </p>
          <div className=" flex flex-col md:flex-row  gap-8">
            <Input
              type={"text"}
              name={"receiverFirstName"}
              placeholder={"First Name"}
              value={order.receiver.firstName}
              handleChange={(e) =>
                dispatch(setReceiverFirstName(e.target.value))
              }
            />
            <Input
              type={"text"}
              name={"receiverLastName"}
              placeholder={"Last Name"}
              value={order.receiver.lastName}
              handleChange={(e) =>
                dispatch(setReceiverLastName(e.target.value))
              }
            />
            <Input
              type={"text"}
              name={"receiverBusinessName"}
              placeholder={"Business Name"}
              value={order.receiver.businessName}
              handleChange={(e) =>
                dispatch(setReceiverBusinessName(e.target.value))
              }
            />
            <PhoneInput
              placeholder="Phone Number"
              country={"ng"}
              onlyCountries={["ng"]}
              prefix="+"
              value={order.receiver.phoneNumber}
              onChange={(phone) => {
                phone = "+" + phone;
                dispatch(setReceiverPhone(phone));
                dispatch(setCustomerDetails(customer));
              }}
              containerClass={"bg-black !w-full"}
              inputClass={"!w-full !min-h-full"}
            />
          </div>

          <div>
            <p className="my-8  font-light text-md mb-1">Receivers Address</p>
            <div className=" my-8 flex flex-col md:flex-row   gap-3">
              <Select
                name={"receiverState"}
                options={statesList}
                value={order.receiver.address.state}
                handleChange={(e) => dispatch(setReceiverState(e.target.value))}
                children={"Select State"}
              />
              <Select
                name={"receiverLga"}
                value={order.receiver.address.lga}
                options={
                  order.receiver.address.state
                    ? states[order.receiver.address.state].lgas
                    : []
                }
                handleChange={(e) => dispatch(setReceiverLga(e.target.value))}
                children={"Select LGA"}
              />
              {order.intraCity === "No" && (
                <Select
                  name={"destinationStation"}
                  value={order.destinationStation}
                  options={stationsList}
                  handleChange={(e) => {
                    dispatch(setDestinationStation(e.target.value));
                    dispatch(
                      setDestinationStationId(stations[e.target.value].id)
                    );
                  }}
                  children={"Destination Station"}
                />
              )}
            </div>
            <Input
              type={"text"}
              name={"receiverStreetAddress"}
              placeholder={"Street Address"}
              value={order.receiver.address.streetAddress}
              handleChange={(e) =>
                dispatch(setReceiverStreetAddress(e.target.value))
              }
            />
          </div>
        </div>
      </div>
      <div id="item-details" className="mb-20">
        <h1 className=" font-bold text-xl text-center ">Item Information</h1>
        <hr className="w-40 mx-auto mt-3 mb-10" />
        <div>
          <p className="text-red-800 font-light text-xs mb-3">
            Enter the Item information; (
            <i>
              Item description, shipment cartegory, item cartegory, and other
              details
            </i>
            )
          </p>
          <div className=" flex flex-col   gap-8">
            <div className="w-full flex flex-col md:flex-row item-center gap-8">
              <div className="w-full flex flex-col md:flex-row items-center gap-8">
                <div className="w-full flex-col md:flex-row items-center gap-8">
                  <p className=" mb-5">Item Description</p>
                  <Textarea
                    name={"itemDescription"}
                    placeholder={
                      "Please write a short description about the item"
                    }
                    value={order.item.description}
                    handleChange={(e) =>
                      dispatch(setItemDescription(e.target.value))
                    }
                    rows={5}
                  />
                </div>
                <div className="w-full flex flex-col items-center gap-8">
                  <div className="w-full flex flex-col md:flex-row item-center gap-8">
                    <Select
                      options={shipmentCartegoryOptions}
                      children={"Select Shipment Cartegory"}
                      value={order.item.cartegory}
                      name={"shipmentCartegory"}
                      handleChange={(e) => {
                        const shipmentCartegory = e.target.value;
                        dispatch(setItemShipment(shipmentCartegory));
                        dispatch(
                          setItemWeight(
                            shipmentCartegory === "Document" ? 1 : ""
                          )
                        );
                        dispatch(
                          setFreightPrice(
                            shipmentCartegory === "Document" ? 1500 : 0
                          )
                        );
                        dispatch(
                          setSubtotal(
                            shipmentCartegory === "Document" ? 1500 : 0
                          )
                        );
                        dispatch(
                          setVAT(
                            shipmentCartegory === "Document"
                              ? 1500 * appBrain.vat
                              : 0
                          )
                        );
                      }}
                    />

                    <Select
                      options={appBrain.itemConditionOptions}
                      name={"itemCondition"}
                      value={order.item.condition}
                      handleChange={(e) =>
                        dispatch(setItemCondition(e.target.value))
                      }
                      children={"Select Item Condition"}
                    />
                  </div>
                  <div className="w-full flex gap-8 items-center">
                    <div className="w-full flex gap-3 items-center">
                      <Input
                        name={"itemValue"}
                        value={order.item.value}
                        handleChange={(e) => {
                          dispatch(setItemValue(e.target.value));
                          dispatch(
                            setInsurance(
                              Math.ceil(e.target.value * appBrain.insurance)
                            )
                          );
                        }}
                        placeholder={"Item Value"}
                      />
                      <span className="text-red-800">NGN</span>
                    </div>
                    <div className="w-full flex items-center gap-3">
                      <Input
                        type={"number"}
                        name={"itemWeight"}
                        value={order.item.weight}
                        handleChange={(e) => {
                          const subtotal =
                            order.item.shipmentCartegory !== "Document" &&
                            e.target.value * 200;
                          dispatch(setItemWeight(e.target.value));
                          dispatch(setFreightPrice(subtotal));
                          dispatch(setSubtotal(subtotal));
                          dispatch(setVAT(subtotal * appBrain.vat));
                        }}
                        placeholder={"Item Weight"}
                      />
                      <span className="text-red-800">KG</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-8 items-center">
                    <Input
                      type={"number"}
                      min={1}
                      name={"itemQuantity"}
                      value={order.item.quantity}
                      handleChange={(e) =>
                        dispatch(setItemQuantity(e.target.value))
                      }
                      placeholder={"Item Quantity"}
                    />
                    <div className="w-full flex items-center gap-3">
                      <div className="flex flex-col place-items-center">
                        <span className=" text-lg">
                          Freight price: <span>{order.freightPrice}</span> NGN
                        </span>
                        <span className="text-red-800 text-xs ">
                          Not total price
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="additional-charges" className="mb-20">
        <h1 className="  font-bold text-xl text-center ">Additional Charges</h1>
        <hr className="w-40 mx-auto mt-3 mb-10" />

        <div>
          <p className="text-red-800 font-light text-xs mb-3">
            Enter all additional charges and click on the button to update
            subtotal: Note that subtotal is without VAT or Insurance
          </p>
        </div>
        <div className="w-full mt-8 flex flex-col md:flex-row flex-wrap gap-10 md:items-end">
          {appBrain.additionalCharges.map((charge, id) => {
            return (
              <div key={id}>
                <span className=" font-regular">{charge.toUpperCase()}</span>
                <Input
                  type={"number"}
                  name={charge}
                  handleChange={(e) => {
                    dispatch(
                      setAdditionalCharges({
                        ...order.additionalCharges,
                        [charge]: e.target.value,
                      })
                    );
                  }}
                />
              </div>
            );
          })}
          <CustomButton
            children={"Add Charges"}
            handleClick={() => {
              const totalAdditionalCharges = Object.keys(
                order.additionalCharges
              )
                .map((charge) => order.additionalCharges[charge])
                .reduce((acc, charge) => acc + +charge, 0);
              dispatch(setTotalAdditionalCharges(totalAdditionalCharges));
              dispatch(
                setSubtotal(order.freightPrice + totalAdditionalCharges)
              );
              dispatch(
                setVAT(
                  appBrain.vat * (order.freightPrice + totalAdditionalCharges)
                )
              );
            }}
          />
        </div>
      </div>
      <div id="totals" className="mb-20 flex-1">
        <h1 className="  font-bold text-xl text-center ">Calculated Charges</h1>
        <hr className="w-40 mx-auto mt-3 mb-10" />

        <div>
          <p className="text-red-800 font-light text-xs mb-3">
            See all calculated charges before proceeding to billing;
          </p>
        </div>
        <div className="w-full mt-8 flex flex-col md:flex-row justify-evenly">
          <p className=" font-medium text-xl">
            Subtotal: <span>{order.subtotal} NGN</span>
          </p>
          <p className=" font-medium text-xl">
            VAT: <span>{order.VAT} NGN</span>
          </p>
          <p className=" font-medium text-xl">
            Insurance: <span>{order.insurance} NGN</span>
          </p>
          <p className=" font-medium text-xl">
            Total: <span>{order.total} NGN</span>
          </p>
        </div>
        <div className="mt-8">
          <CustomButton
            handleClick={() => {
              dispatch(setProcessedBy(currentUser.id));
              dispatch(setOrderId());
              dispatch(setTotal(order.subtotal + order.VAT + order.insurance));
            }}
            children={"Calculate Total"}
          />
        </div>
      </div>
      {/* payment method selection */}
      {/* <div id="payment" className="mb-20">
        <h1 className="  font-bold text-xl text-center ">
          Payment instructions
        </h1>
        <hr className="w-40 mx-auto mt-3 mb-10" />
        <div className=" flex gap-8 items-center">
          <span className=" font-medium">Pay on Delivery</span>
          <Select
            options={appBrain.cashOnDeliveryOptions}
            name={"payOnDelivery"}
            value={order.payOnDelivery}
            children={"Select one"}
            handleChange={(e) => dispatch(setPayOnDelivery(e.target.value))}
          />
        </div>
        <div className="w-full mt-8 flex flex-col md:flex-row flex-wrap gap-10">
          {order.payOnDelivery === "No" && (
            <div className=" flex gap-8 w-full items-center">
              <span className=" font-medium">Select payment type</span>
              <Select
                options={appBrain.paymentTypes}
                name={"paymentType"}
                value={order.paymentMode}
                children={"Select one"}
                handleChange={(e) => dispatch(setPaymentMode(e.target.value))}
              />
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default OrderForm;
