import React from "react";
import { Button } from "../ui/button";
import { IEvent } from "@/lib/models/event.model";

const Checkout = ({event, userId} : {event: IEvent, userId: string}) => {
  const onCheckout = async () => {
    console.log("checkedout");
  };
  return (
    <form action={onCheckout} method="post">
      <Button>
        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
      </Button>
    </form>
  );
};

export default Checkout;
