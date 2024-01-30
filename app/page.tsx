"use client";

import { ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/DateTimePicker";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const [data, setData] = useState<{
    cartValue: number | undefined;
    distance: number | undefined;
    itemCount: number | undefined;
  }>({
    cartValue: undefined,
    distance: undefined,
    itemCount: undefined,
  });
  const [date, setDate] = useState<
    | {
      date: Date;
      hasTime: boolean;
    }
    | undefined
  >();

  const [deliveryOption, setDeliverOption] = useState<"asap" | "later" | "">(
    "",
  );

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<any>(null);

  const [deliveryFee, setDeliveryFee] = useState<number | undefined>(undefined);

  const handleNumberOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    isFloat: boolean = false,
  ) => {
    const inputValue = e.target.value;
    const fieldName = e.target.name as keyof typeof data;

    let newValue = isFloat
      ? /^\d+(\.\d{0,2})?$/.test(inputValue) || inputValue === ""
        ? inputValue === "" || /^\d+\.$/.test(inputValue)
          ? inputValue
          : parseFloat(inputValue)
        : data[fieldName] || ""
      : /^\d+$/g.test(inputValue) || inputValue === ""
        ? inputValue === ""
          ? ""
          : parseInt(inputValue)
        : data[fieldName] || "";

    setData((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));
  };

  const handleDateTimeChange = (newDateTime: Date) => {
    setDate({ date: newDateTime, hasTime: true });
  }

  const deliveryOptionHandler = (value: string) => {
    if (value === "asap") {
      setDate({ date: new Date(Date.now()), hasTime: true });
    }
    setDeliverOption(value as typeof deliveryOption);
  };

  const errorMissingFieldHandler = () => {
    let errors = "";
    if (!data.cartValue || data.cartValue == 0) {
      errors += "Cart value,\xa0";
    }
    if (!data.distance || data.distance == 0) {
      errors += "Distance,\xa0";
    }
    if (!data.itemCount || data.itemCount == 0) {
      errors += "Amount,\xa0";
    }
    if (!date?.date || !date?.hasTime) {
      errors += "Delivery time,\xa0";
    }

    if (errors.length > 0) {
      errors = errors.slice(0, -2);
      setErrorMessage(`Field(s): ${errors} must be valid`);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setTimeoutId(
        setTimeout(() => {
          setErrorMessage("");
        }, 5000),
      );
      return true;
    } else {
      setErrorMessage("");
      return false;
    }
  };

  const calculateDeliveryFee = () => {
    if (errorMissingFieldHandler()) {
      return;
    }

    setData((prev) => ({
      ...prev,
      cartValue: data.cartValue ? data.cartValue * 1 : undefined
    }))

    let deliveryFee = 0;
    //The delivery is free (0€) when the cart value is equal or more than 200€.
    if (data.cartValue && data.cartValue >= 200) {

      setDeliveryFee(0);
      return;
    }
    //If the cart value is less than 10€, a small order surcharge is added to the delivery price. The surcharge is the difference between the cart value and 10€. For example if the cart value is 8.90€, the surcharge will be 1.10€.
    if (data.cartValue && data.cartValue < 10) {
      deliveryFee += 10 - data.cartValue;
    }
    //A delivery fee for the first 1000 meters (=1km) is 2€. If the delivery distance is longer than that, 1€ is added for every additional 500 meters
    if (data.distance) {
      deliveryFee += 2 + Math.max(0, Math.ceil((data.distance - 1000) / 500));
    }
    //If the number of items is five or more, an additional 50 cent surcharge is added for each item above and including the fifth item. An extra "bulk" fee applies for more than 12 items of 1,20€
    if (data.itemCount && data.itemCount > 4) {
      const extraBulkFee = data.itemCount > 12 ? 1.2 : 0;
      deliveryFee += (data.itemCount - 4) * 0.5 + extraBulkFee;
    }
    //During the Friday rush, 3 - 7 PM, the delivery fee (the total fee including possible surcharges) will be multiplied by 1.2x.
    if (date?.date.getDay() == 5) {
      if (date?.date.getHours() >= 15 && date?.date.getHours() <= 18) {
        deliveryFee *= 1.2;
      }
    }
    //The delivery fee can never be more than 15€, including possible surcharges.
    if (deliveryFee > 0)
      setDeliveryFee(Math.min(15, Number.parseFloat(deliveryFee.toFixed(2))));
  };

  const resetFormHandler = () => {
    setData({
      cartValue: undefined,
      distance: undefined,
      itemCount: undefined,
    });
    setDate(undefined);
    setDeliverOption("");
    clearTimeout(timeoutId);
    setTimeoutId(null);
    setErrorMessage("");
    setDeliveryFee(undefined);
  };

  console.log(data, date)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-primary">
            Delivery Fee Calculator
          </CardTitle>
          <CardDescription>
            Precisely calculate delivery fee on your order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>

            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Cart value (in €)</Label>
                <Input
                  value={data.cartValue ? data.cartValue : ""}
                  id="cartValue"
                  name="cartValue"
                  type="text"
                  placeholder="e.g.: €20"
                  onChange={(e) => handleNumberOnChange(e, true)}
                  data-test-id="cartValue"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Delivery distance (in meter)</Label>
                <Input
                  value={data.distance ? data.distance : ""}
                  id="distance"
                  name="distance"
                  type="text"
                  placeholder="e.g.: 800m"
                  onChange={handleNumberOnChange}
                  data-test-id="deliveryDistance"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Amount of items</Label>
                <Input
                  value={data.itemCount ? data.itemCount : ""}
                  id="itemCount"
                  name="itemCount"
                  type="text"
                  placeholder="e.g.: 3"
                  onChange={handleNumberOnChange}
                  data-test-id="numberOfItems"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Delivery Time</Label>
                <Select
                  value={deliveryOption}
                  onValueChange={deliveryOptionHandler}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select delivery time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">As soon as possible</SelectItem>
                    <SelectItem value="later">Scheduled delivery</SelectItem>
                  </SelectContent>
                </Select>
                {deliveryOption == "later" ? (
                  <DateTimePicker
                    value={date}
                    onChange={setDate}
                    data-test-id="orderTime"
                  ></DateTimePicker>
                ) : null}
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetFormHandler}>
            Reset
          </Button>
          <Button onClick={calculateDeliveryFee}>Calculate</Button>
        </CardFooter>

        {errorMessage && (
          <CardFooter>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </CardFooter>
        )}

        {deliveryFee !== undefined && (
          <CardFooter>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-full">
                    Final delivering cost
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-normal">Item subtotal</TableCell>
                  <TableCell className="text-right">
                    €{data.cartValue}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-normal">Delivery fee</TableCell>
                  <TableCell className="text-right">
                    {deliveryFee == 0 ? "Free" : "€" + deliveryFee}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell data-test-id="fee" className="text-right font-semibold">
                    €{deliveryFee + (data.cartValue || 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardFooter>
        )}
      </Card>
    </main>
  );
}
