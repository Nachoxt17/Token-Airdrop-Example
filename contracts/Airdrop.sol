pragma solidity ^0.8.3;

//+-We Import the ERC-20 Token Standard Interface to interact with ERC-20 Tokens:_
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop {
    //+-We define an Admin that will be used to Verify signatures of Token Claimings:_
    address public admin;
    //+-We define a register (Mapping) of Claimers Addresses to preventing them of Claiming Tokens twice:_
    mapping(address => bool) public processedAirdrops;
    //+-Pointer to the ERC-20 Token Standard Interface:_
    IERC20 public token;
    //+-Total amount of already distributed Tokens:_
    uint256 public currentAirdropAmount;
    //+-Maximum amount of Tokens to give away in the AirDrop. 100.000 with 18 Decimals.
    uint256 public maxAirdropAmount = 100000 * 10**18;

    //+-We create an Event for every time we process an AirDrop:_
    event AirdropProcessed(address recipient, uint256 amount, uint256 date);

    //+-In the constructor we define de Address of the Token to be AirDropped:_
    constructor(address _token, address _admin) {
        admin = _admin;
        //+-We initialize a pointer to the Token to be AirDropped:_
        token = IERC20(_token);
    }

    //+-We can change the Administrator if needed:_
    function updateAdmin(address newAdmin) external {
        require(msg.sender == admin, "only admin");
        admin = newAdmin;
    }

    //+-This is the Function that every recipient will have to call in order to claim the Token:_
    function claimTokens(
        address recipient,
        uint256 amount,
        bytes calldata signature //+-Signature provided by the AirDrop Back-End.
    ) external {
        bytes32 message =
            prefixed(keccak256(abi.encodePacked(recipient, amount)));/**+-Here we compute the Signature of the message concatenating the 
            recipient Address and the Amount of Tokens that will receive using "abi.encodePacked".*/
        require(recoverSigner(message, signature) == admin, "wrong signature");/**+-Here we make sure that the Signature is valid.*/
        require(
            processedAirdrops[recipient] == false,
            "airdrop already processed"
        );
        require(
            currentAirdropAmount + amount <= maxAirdropAmount,
            "airdropped 100% of the tokens"
        );
        processedAirdrops[recipient] = true;
        currentAirdropAmount += amount;
        token.transfer(recipient, amount);
        emit AirdropProcessed(recipient, amount, block.timestamp);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        internal
        pure
        returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            uint8,
            bytes32,
            bytes32
        )
    {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
