// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//+-We will use Mongoose to interact with MongoDB that we will use to store the WhiteList of claimers Addresses and their Token allocations:_
import mongoose from 'mongoose';
//+-We will use Web3.js to produce our Signature:_
import Web3 from 'web3';

const recipientSchema = new mongoose.Schema({
  address: String,
  basicAllocation: String,
  bonusAllocation: String,
  totalAllocation: String
});
  const Recipient = mongoose.models.Recipient || mongoose.model(
    'Recipient', 
    recipientSchema, 
    'recipients'
  );

//+-When the Front-End will request a Signature this endpoint will be executed:_
export default async (req, res) => {
  //+-(1)-Connect our DataBase:_
  await mongoose.connect(
    process.env.DB_URL, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  //+-We will get the record for the Address of the recipient that the Front-End will give us:_
  const recipient = await Recipient
    .findOne({ address: req.body.address && req.body.address.toLowerCase() })
    .exec();
  //+-(2)-If record found, create and return a signature:_
  if(recipient) {
    const message = Web3.utils.soliditySha3(
      {t: 'address', v: recipient.address},
      {t: 'uint256', v: recipient.totalAllocation.toString()}
    ).toString('hex');
    /**+-At the end of the registration period, the Admin will run a Script that will determine the Tokens Allocation of each recipient Address.*/
    const web3 = new Web3('');
    //+-Here is were the Signature is produced:_
    const { signature } = web3.eth.accounts.sign(
      message, 
      process.env.PRIVATE_KEY
    );
    res
      .status(200)
      .json({ 
        address: req.body.address, 
        basicAllocation: recipient.basicAllocation,
        bonusAllocation: recipient.bonusAllocation,
        totalAllocation: recipient.totalAllocation,
        signature
      });
    return;
  }
  //+-(3)-Otherwise, return error:_
  res
    .status(401)
    .json({ address: req.body.address });
}
