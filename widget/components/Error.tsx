import { FC } from "@hono/hono/jsx/dom";

interface ErrorProps {
    code: number;
    message: string;
}

export const Error: FC<ErrorProps> = ({ code, message }) => <div className="error">An Error has occurred "{message}" [Code {code}]</div> 