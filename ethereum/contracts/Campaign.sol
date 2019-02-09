pragma solidity ^0.5.3;

contract CampaignFactory {
    address[] public deployedCampaigns;

    address[] public freelancers;

    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);

        deployedCampaigns.push(address(newCampaign));

        emit CreateCampaign(address(newCampaign));
    }

    event CreateCampaign(address _address);

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

    function createFreelancer() public {
        Freelancer newFreelancer = new Freelancer(msg.sender);

        freelancers.push(address(newFreelancer));

        emit CreateFreelancer(address(newFreelancer));
    }

    event CreateFreelancer(address _address);

    function getFreelancers() public view returns (address[] memory) {
        return freelancers;
    }
}

contract Freelancer {
    address public manager;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(address creator) public {
        manager = creator;
    }

    function getSummary() public view returns (
        uint, address
    ) {
        return (
        address(this).balance,
        manager
        );
    }

    function () external payable {
        emit PaidFreelancer(msg.value);
    }

    event PaidFreelancer(uint amount);
}

contract Campaign {
    struct Request {
        uint value;
        address payable freelancer;
        uint status;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(uint value, address payable freelancer) public restricted {
        Request memory newRequest = Request({
            value: value,
            freelancer: freelancer,
            status: 0,
            approvalCount: 0
            });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;

        if(request.approvalCount > (approversCount / 2)) {
            emit SendRequest();
        }
    }

    event SendRequest();

    function commenceRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.status == 0);
        require(request.approvalCount > (approversCount / 2));

        request.freelancer.transfer(request.value / 2);
        request.status = 1;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.status == 1);

        request.freelancer.transfer(request.value / 2);
        request.status = 2;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
        minimumContribution,
        address(this).balance,
        requests.length,
        approversCount,
        manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
