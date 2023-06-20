import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Switch, Menu, IconButton } from "grindery-ui";
import GrinderyClient from "grindery-nexus-client";
import { Connector } from "../types/Connector";
import { CustomListItem } from "../components";
import { Workflow } from "../types/Workflow";
import { useAppDispatch, useAppSelector } from "../store";
import { selectUserStore, userStoreActions } from "../store/slices/userSlice";
import { ICONS } from "../config";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding: 0 0 20px;
  gap: 20px;
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const ItemTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Title = styled.span`
  position: relative;
  font-weight: 400;
  font-size: var(--text-size-list-item-label);
  line-height: 150%;
  color: #0b0d17;
  display: inline-block;
  padding-right: 24px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0);
  cursor: text;

  &:hover {
    border-bottom: 1px dashed #898989;
  }
  &:hover:after {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    position: absolute;
    right: 1px;
    background-image: url(/images/icons/pencil.svg);
    background-position: center center;
    background-repeat: no-repeat;
    top: 5px;
  }
`;

const TitleInput = styled.input`
  background: none;
  border: none;
  border-bottom: 1px dashed #898989;
  display: inline-block;
  font-weight: 400;
  font-size: var(--text-size-list-item-label);
  line-height: 150%;
  padding: 0;
  color: #0b0d17;
  outline: none;
  width: auto;
  max-width: 200px;
  font-family: Roboto;
  max-width: 340px;
`;

const ItemAppsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 4px;
`;

const ItemAppWrapper = styled.div`
  padding: 4px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
`;

const ItemAppIcon = styled.img`
  display: block;
  width: 16px;
  height: 16px;
`;

const ItemActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
`;

const MenuButtonWrapper = styled.div`
  & img {
    width: 12px;
    height: 12px;
  }
`;

type Props = {
  connectors: Connector[];
  workflows: Workflow[];
};

const WorkflowsList = (props: Props) => {
  const { connectors, workflows } = props;

  return (
    <Wrapper>
      <ItemsWrapper>
        {workflows.map((item) => (
          <WorkflowRow key={item.key} item={item} connectors={connectors} />
        ))}
      </ItemsWrapper>
    </Wrapper>
  );
};

type WorkflowRowProps = {
  item: any;
  connectors: Connector[];
};

const WorkflowRow = ({ item, connectors }: WorkflowRowProps) => {
  const [title, setTitle] = useState(item.title || "");
  const [editTitle, setEditTitle] = useState(false);
  const [width, setWidth] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);
  const titleEl = useRef<HTMLSpanElement>(null);

  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(selectUserStore);
  const [enabled, setEnabled] = useState(item.state === "on");
  const triggerIcon =
    connectors.find((t) => t.key === item.trigger?.connector)?.icon || null;

  const triggerAppName =
    connectors.find((t) => t.key === item.trigger?.connector)?.name || null;

  const actionsIcons = (item.actions || [])
    .map(
      (action: any) => connectors.find((a) => a.key === action.connector)?.icon
    )
    .filter((a: any) => a);

  const actionsAppName = (item.actions || [])
    .map(
      (action: any) => connectors.find((a) => a.key === action.connector)?.name
    )
    .filter((a: any) => a);

  const handleToggleChange = async () => {
    const client = new GrinderyClient(accessToken);

    const wf = { ...item, state: item.state === "on" ? "off" : "on" };
    delete wf.signature;
    wf.signature = JSON.stringify(wf);

    try {
      setEnabled(item.state === "on" ? false : true);
      await client.workflow.update({ key: wf.key, workflow: wf });
    } catch (err) {
      setEnabled(item.state === "on" ? true : false);
    }
  };

  const handleTitleClick = () => {
    setEditTitle(true);
  };

  const handleTitleBlur = async () => {
    setEditTitle(false);
    if (title !== item.title) {
      const wf = { ...item, title };
      delete wf.signature;
      wf.signature = JSON.stringify(wf);
      const client = new GrinderyClient(accessToken);
      try {
        await client.workflow.update({ key: wf.key, workflow: wf });
      } catch (err) {
        //
      }
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = async () => {
    const client = new GrinderyClient(accessToken);
    try {
      await client.workflow.delete({ key: item.key });
      const wfs = await client.workflow.list({});
      dispatch(
        userStoreActions.setWorkflows(wfs?.map((wr: any) => wr.workflow) || [])
      );
    } catch (err) {}
  };

  const handleEditClick = () => {
    dispatch(userStoreActions.setWorkflowKey(item.key));
  };

  useEffect(() => {
    if (editTitle && inputEl.current) {
      inputEl.current.select();
    }
  }, [editTitle]);

  useEffect(() => {
    if (titleEl.current) {
      setWidth(titleEl.current.offsetWidth - 22);
    }
  }, [title]);

  return (
    <CustomListItem
      key={item.key}
      size="small"
      LeftComponent={
        <ItemTitleWrapper>
          <ItemAppsWrapper>
            {triggerIcon && (
              <ItemAppWrapper>
                <ItemAppIcon
                  src={triggerIcon}
                  alt="trigger app icon"
                  title={triggerAppName || ""}
                />
              </ItemAppWrapper>
            )}

            {actionsIcons.length > 0 &&
              actionsIcons.map((icon: any, i2: number) => (
                <ItemAppWrapper key={item.key + i2}>
                  <ItemAppIcon
                    src={icon}
                    alt="action app icon"
                    title={actionsAppName[i2] || ""}
                  />
                </ItemAppWrapper>
              ))}
          </ItemAppsWrapper>

          <Title
            ref={titleEl}
            style={{
              position: !editTitle ? "relative" : "absolute",
              opacity: !editTitle ? 1 : 0,
            }}
            onClick={handleTitleClick}
          >
            {title}
          </Title>
          {editTitle && (
            <TitleInput
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value || "New workflow");
              }}
              onBlur={handleTitleBlur}
              ref={inputEl}
              style={{ width }}
            />
          )}
        </ItemTitleWrapper>
      }
      RightComponent={
        <ItemActionsWrapper>
          <Switch value={enabled} onChange={handleToggleChange} />
          <MenuButtonWrapper>
            <IconButton onClick={handleMenuOpen} icon={ICONS.DOTS_HORIZONTAL} />
          </MenuButtonWrapper>
          <Menu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            closeOnClick
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            items={[
              {
                key: "rename",
                label: "Rename",
                onClick: handleTitleClick,
              },
              {
                key: "edit",
                label: "Edit",
                onClick: handleEditClick,
              },
              {
                key: "delete",
                label: "Delete",
                onClick: handleDelete,
              },
            ]}
          />
        </ItemActionsWrapper>
      }
    />
  );
};

export default WorkflowsList;
