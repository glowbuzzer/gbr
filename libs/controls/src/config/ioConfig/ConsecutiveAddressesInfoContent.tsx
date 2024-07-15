import * as React from "react"
import { PopoverContent } from "./commonStyles"

export const ConsecutiveAddressesInfoContent = () => (
    <PopoverContent>
        Objects having an address that is consecutive with another object get grouped together (if
        the are on the same slave number).
        <br />
        This is shown by the coloured highlighting in the table if you select show IO groups.
        <br />
        IO objects with consecutive addresses will be read using the read multiple Modbus functions.
        <br />
        This feature can be used to optimize the speed of reading from the Modbus network.
        <br />
        It also ensures the values read from the slave are "synchronised".
        <br />
        This is especially useful when reading integer values of greater than 16 bit length from
        modbus slaves.
    </PopoverContent>
)
