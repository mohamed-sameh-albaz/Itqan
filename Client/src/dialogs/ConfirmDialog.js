import { Button, Dialog, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { useState } from "react";

const ConfirmDialog = ({ open, onClose, onConfirm, title, choice1, choice2}) => {
    const [waiting, setWaiting] = useState(false);

    async function handleConfirm(){
        setWaiting(true);
        await onConfirm();
        setWaiting(false);
    }

    return (<Dialog open={open} onClose={onClose}>
        <DialogHeader>{title}</DialogHeader>
        <DialogFooter>
            <Button variant='outlined' onClick={onClose}>{choice1}</Button>
            <Button loading={waiting} variant='filled' onClick={()=>handleConfirm()}>{choice2}</Button>
        </DialogFooter>
        </Dialog>);
}

export {ConfirmDialog};