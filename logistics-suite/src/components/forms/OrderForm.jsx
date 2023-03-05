import React, { useState } from "react";
import { appBrain, idGenerator } from "../../AppBrain";
import Select from "../select-input/select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Input from "../input/input";
import CustomButton from "../button/button.jsx";
import Textarea from "../textarea/textarea.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  setIntraCity,
  setDeliveryType,
  setDeliveryService,
  setOriginStation,
  setDestinationStation,
  setOriginStationId,
  setDestinationStationId,
  setReceiverFirstName,
  setReceiverLastName,
  setReceiverPhone,
  setReceiverState,
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
import { useNewWaybillContext } from "../../contexts/NewWaybillContext";

const OrderForm = () => {
  const [orderid] = useState(idGenerator(9));
  const { currentUser } = useUserContext();
  const [originStateCode, setOriginStateCode] = useState("");
  const [destinationStateCode, setDestinationStateCode] = useState("");
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);
  const order = useSelector((state) => state.order);
  const { newCustomer } = useNewWaybillContext();
  const { states, statesList, stations, pricing, pricingList } =
    useAppConfigContext();
  const [stationsList, setStationsList] = useState([""]);
  const setId = () => {
    dispatch(
      setOrderId(
        `${originStateCode}-${orderid}${
          destinationStateCode && "-"
        }${destinationStateCode}`
      )
    );
  };
  const Reduction = order.intraCity === "Yes" ? 0.6 : 1;
  return (
    newCustomer &&
    pricing && (
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
                  <p className=" mb-5">Local Delivery*?</p>
                  <Select
                    name={"intraCity"}
                    value={order.intraCity}
                    required
                    options={appBrain.interCityOptions}
                    handleChange={(e) => {
                      dispatch(setIntraCity(e.target.value));
                      dispatch(setOriginStation(currentUser.station));
                      dispatch(
                        setOriginStationId(stations[currentUser.station].id)
                      );
                      setOriginStateCode(
                        stations[currentUser.station].shortCode
                      );
                    }}
                    children={"Select one"}
                  />
                </div>

                {order.intraCity === "No" && (
                  <div className="w-full flex flex-col items-center">
                    <p className=" mb-5">Delivery type*</p>
                    <Select
                      name={"deliveryType"}
                      required
                      value={order.deliverType}
                      options={appBrain.deliveryTypeOptions}
                      handleChange={(e) => {
                        dispatch(setDeliveryType(e.target.value));
                        dispatch(setOriginStation(currentUser.station));
                        dispatch(
                          setOriginStationId(stations[currentUser.station].id)
                        );
                        setOriginStateCode(
                          stations[currentUser.station].shortCode
                        );
                      }}
                      children={"Type of Delivery"}
                    />
                  </div>
                )}
                {order.intraCity === "No" && (
                  <div className="w-full flex flex-col items-center">
                    <p className="mb-5 text-center">Delivery Service*</p>
                    <Select
                      name={"serviceType"}
                      value={order.deliverService}
                      required
                      options={appBrain.serviceTypeOptions}
                      handleChange={(e) => {
                        dispatch(setDeliveryService(e.target.value));
                        dispatch(setOriginStation(currentUser.station));
                        dispatch(
                          setOriginStationId(stations[currentUser.station].id)
                        );
                        setOriginStateCode(
                          stations[currentUser.station].shortCode
                        );
                      }}
                      children={"Delivery Service"}
                    />
                  </div>
                )}
                <div className="w-full flex flex-col items-center">
                  <p className=" mb-5 text-center">Origin Station*</p>
                  <p>{order.originStation}</p>
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
                placeholder={"First Name*"}
                required
                value={order.receiver.firstName}
                handleChange={(e) =>
                  dispatch(setReceiverFirstName(e.target.value))
                }
              />
              <Input
                type={"text"}
                placeholder={"Last Name*"}
                required
                value={order.receiver.lastName}
                handleChange={(e) =>
                  dispatch(setReceiverLastName(e.target.value))
                }
              />

              <PhoneInput
                placeholder="Phone Number*"
                country={"ng"}
                onlyCountries={["ng"]}
                inputProps={{
                  required: true,
                  maxLength: 18,
                }}
                prefix="+"
                value={order.receiver.phoneNumber}
                required
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
                  required
                  value={order.receiver.address.state}
                  handleChange={(e) => {
                    dispatch(setReceiverState(e.target.value));
                    Object.keys(states[e.target.value].stations).length &&
                      setStationsList(
                        Object.keys(states[e.target.value].stations)
                      );
                  }}
                  children={"Select State"}
                />

                {order.intraCity === "No" && (
                  <Select
                    name={"destinationStation"}
                    value={order.destinationStation}
                    required
                    options={stationsList}
                    handleChange={(e) => {
                      const value = e.target.value;
                      dispatch(setDestinationStation(value));
                      value
                        ? dispatch(setDestinationStationId(stations[value].id))
                        : dispatch(setDestinationStationId(""));
                      value
                        ? setDestinationStateCode(stations[value].shortCode)
                        : setDestinationStateCode("");
                    }}
                    children={"Destination Station"}
                  />
                )}
              </div>
              <Textarea
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
                      required
                      value={order.item.description}
                      handleChange={(e) =>
                        dispatch(
                          setItemDescription(e.target.value.toUpperCase())
                        )
                      }
                      rows={5}
                    />
                  </div>
                  <div className="w-full flex flex-col items-center gap-8">
                    <div className="w-full flex flex-col md:flex-row item-center gap-8">
                      <Select
                        options={pricingList}
                        required
                        children={"Select Cartegory*"}
                        value={order.item.cartegory}
                        name={"shipmentCartegory"}
                        handleChange={(e) => {
                          const shipmentCartegory = e.target.value;
                          dispatch(setItemShipment(shipmentCartegory));
                          if (!shipmentCartegory) {
                            dispatch(setItemWeight(0));

                            dispatch(setFreightPrice(0));

                            dispatch(setSubtotal(0));

                            dispatch(setVAT(0));
                          }

                          pricing[shipmentCartegory]?.weight &&
                            dispatch(
                              setItemWeight(pricing[shipmentCartegory].weight)
                            );
                          pricing[shipmentCartegory]?.price &&
                            dispatch(
                              setFreightPrice(
                                pricing[shipmentCartegory].price * Reduction
                              )
                            );
                          pricing[shipmentCartegory]?.price &&
                            dispatch(
                              setSubtotal(
                                pricing[shipmentCartegory].price * Reduction
                              )
                            );
                          pricing[shipmentCartegory]?.price &&
                            dispatch(
                              setVAT(
                                appBrain.vat *
                                  pricing[shipmentCartegory].price *
                                  Reduction
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
                          value={order.item.value ? order.item.value : ""}
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
                          disabled={!order.item.cartegory}
                          required
                          value={order.item.weight ? order.item.weight : ""}
                          handleChange={(e) => {
                            dispatch(setItemWeight(e.target.value));
                            if (pricing[order.item.cartegory].ppw) {
                              const subtotal =
                                e.target.value *
                                pricing[order.item.cartegory].ppw *
                                Reduction;

                              dispatch(setFreightPrice(subtotal));
                              dispatch(setSubtotal(subtotal));
                              dispatch(setVAT(subtotal * appBrain.vat));
                            }
                          }}
                          min={
                            order.item.cartegory
                              ? pricing[order.item.cartegory].min
                              : 0
                          }
                          max={
                            order.item.cartegory
                              ? pricing[order.item.cartegory].max
                              : 10000000000
                          }
                          placeholder={"Item Weight*"}
                        />
                        <span className="text-red-800">KG</span>
                      </div>
                    </div>
                    <div className="w-full flex gap-8 items-center">
                      <Input
                        type={"number"}
                        min={1}
                        value={order.item.quantity ? order.item.quantity : ""}
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
          <h1 className="  font-bold text-xl text-center ">
            Additional Charges
          </h1>
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
          <h1 className="  font-bold text-xl text-center ">
            Calculated Charges
          </h1>
          <hr className="w-40 mx-auto mt-3 mb-10" />

          <div>
            <p className="text-red-800 font-light text-xs mb-3">
              See all calculated charges before proceeding to billing;
            </p>
          </div>
          <div className="w-full mt-8 flex flex-col md:flex-row justify-evenly flex-wrap">
            <p className=" font-medium text-xl">
              Subtotal: <span>{order.subtotal} NGN</span>
            </p>
            {customer.customerType === "E-commerce" && (
              <p className=" font-medium text-xl">
                E-commerce Discount: <span>{0.4 * order.subtotal} NGN</span>
              </p>
            )}
            <p className=" font-medium text-xl">
              VAT: <span>{order.VAT} NGN</span>
            </p>
            {order.insurance ? (
              <p className=" font-medium text-xl">
                Insurance: <span>{order.insurance} NGN</span>
              </p>
            ) : (
              ""
            )}
            <p className=" font-medium text-xl">
              Total: <span>{order.total} NGN</span>
            </p>
          </div>
          <div className="mt-8">
            <CustomButton
              handleClick={() => {
                dispatch(setProcessedBy(currentUser.id));
                dispatch(
                  setTotal(
                    (customer.customerType === "E-commerce"
                      ? 0.6 * order.subtotal
                      : order.subtotal) +
                      order.VAT +
                      order.insurance
                  )
                );

                setId();
              }}
              children={"Calculate Total*"}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default OrderForm;
