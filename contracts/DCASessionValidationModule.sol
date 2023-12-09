// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./ISessionValidationModule.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title ERC20 Session Validation Module for Biconomy Smart Accounts.
 * @dev Validates userOps for ERC20 transfers and approvals using a session key signature.
 *         - Recommended to use with standard ERC20 tokens only
 *         - Can be used with any method of any contract which implement
 *           method(address, uint256) interface
 *
 * @author Fil Makarov - <filipp.makarov@biconomy.io>
 */

contract DCASessionValidationModule is ISessionValidationModule {
    /**
     * @dev validates that the call (destinationContract, callValue, funcCallData)
     * complies with the Session Key permissions represented by sessionKeyData
     * @param destinationContract address of the contract to be called
     * @param callValue value to be sent with the call
     * @param _funcCallData the data for the call. is parsed inside the SVM
     * @param _sessionKeyData SessionKey data, that describes sessionKey permissions
     */
    function validateSessionParams(
        address destinationContract,
        uint256 callValue,
        bytes calldata _funcCallData,
        bytes calldata _sessionKeyData,
        bytes calldata /*_callSpecificData*/
    ) external virtual override returns (address) {
        (address sessionKey, uint256 afterDays )  = abi.decode(_sessionKeyData, (address, uint256));
        
        return sessionKey;
    }


    function isSessionActive(uint256 startTime, uint256 interval, uint256 duration) public view returns (bool){
        uint256 timeSinceStart = block.timestamp - startTime;
        uint256 currentCycle = timeSinceStart / interval;
        uint256 cycleStart = startTime + currentCycle * interval;
        uint256 cycleEnd = cycleStart + duration;

        return block.timestamp >= cycleStart && block.timestamp <= cycleEnd;
    }

    function validateSessionUserOp(
        UserOperation calldata _op,
        bytes32 _userOpHash,
        bytes calldata _sessionKeyData,
        bytes calldata _sessionKeySignature
    ) external view override returns (bool) {
        ( address sessionKey, uint256 daysAfter )  = abi.decode(_sessionKeyData, (address, uint256));

        uint256 interval = daysAfter * 1 days;
        uint256 duration = 1 days;
        uint256 startTime = block.timestamp - (block.timestamp % interval); // Align start time with the first cycle

        return
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(_userOpHash),
                _sessionKeySignature
            ) == sessionKey;
    }
}
