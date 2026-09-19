const TicketService = require("../services/TicketService");

const service = new TicketService();

exports.create = (req, res) => {
  const ticket = service.createTicket(req.body);
  res.status(201).json(ticket);
};

exports.list = (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 5;

  if (page < 1 || limit < 1) {
    const error = new Error("page y limit deben ser mayores a cero");
    error.statusCode = 400;
    throw error;
  }

  res.status(200).json(service.list(page, limit));
};

exports.assign = (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  const ticket = service.assignTicket(id, user);

  if (!ticket) {
    return res.status(404).json({ error: "Ticket no encontrado" });
  }

  res.status(200).json(ticket);
};

exports.changeStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = service.changeStatus(id, status);

  if (!ticket) {
    return res.status(404).json({ error: "Ticket no encontrado" });
  }

  res.status(200).json(ticket);
};

exports.delete = (req, res) => {
  try {
    service.deleteTicket(req.params.id);
    res.status(200).json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};